/**
 * Erasure: deleting an Account and everything that belongs to its Person,
 * with no retention window (docs/specs/identity.md).
 */
import { erasureCounts, persons, signInEvents } from "@schema";
import { db, inArray, sql } from "void/db";
import type { AccountId, PersonId } from "../../domains/identity/events";
import { isRecentSignIn, normaliseEmail, unverifiedCutoff } from "../../domains/identity/rules";
import { dispatch } from "../events";
import { rowsOf, type Tx } from "../db";
import { identityEmails } from "./emails";

/** Stored files live under one prefix per Person. Records provides the real adapter once storage exists. */
export interface PersonFiles {
  deleteAllFor(personId: PersonId): Promise<void>;
}

/** Until the Records context provisions storage (EU jurisdiction, ADR 0001) there are no files to delete. */
export const noPersonFiles: PersonFiles = { deleteAllFor: async () => {} };

export class ErasureRefused extends Error {
  constructor(
    readonly reason: "recent_sign_in_required" | "confirmation_mismatch",
    message: string,
  ) {
    super(message);
  }
}

/** Removes every Identity row for these Accounts, inside the caller's transaction. Auth rows cascade from `user`. */
async function deleteAccountRows(tx: Tx, accountIds: AccountId[]): Promise<PersonId[]> {
  if (accountIds.length === 0) return [];
  const held = await tx.select({ id: persons.id, accountId: persons.accountId }).from(persons).where(inArray(persons.accountId, accountIds));
  for (const person of held) await dispatch({ type: "PersonErased", personId: person.id, accountId: person.accountId }, tx);
  await tx.delete(persons).where(inArray(persons.accountId, accountIds));
  await tx.delete(signInEvents).where(inArray(signInEvents.accountId, accountIds));
  // Password-reset tokens store the Account id as their value.
  await tx.execute(sql`delete from "verification" where "value" in ${accountIds}`);
  await tx.execute(sql`delete from "user" where "id" in ${accountIds}`);
  return held.map((p) => p.id);
}

export async function eraseAccount(
  input: { accountId: AccountId; accountEmail: string; signedInAt: Date; typedEmail: string },
  files: PersonFiles = noPersonFiles,
  now = new Date(),
): Promise<void> {
  if (!isRecentSignIn(input.signedInAt, now))
    throw new ErasureRefused("recent_sign_in_required", "For your safety, please sign in again before deleting your account.");
  if (normaliseEmail(input.typedEmail) !== normaliseEmail(input.accountEmail))
    throw new ErasureRefused("confirmation_mismatch", "That does not match your account's email address. Type it exactly to confirm.");

  const personIds = await db.transaction(async (tx) => {
    const ids = await deleteAccountRows(tx, [input.accountId]);
    const day = now.toISOString().slice(0, 10);
    await tx
      .insert(erasureCounts)
      .values({ day, count: 1 })
      .onConflictDoUpdate({ target: erasureCounts.day, set: { count: sql`${erasureCounts.count} + 1` } });
    return ids;
  });

  // Stored files cannot join the database transaction. They are removed after
  // commit; the orphaned-storage sweep catches any that fail here.
  for (const personId of personIds) {
    try {
      await files.deleteAllFor(personId);
    } catch (error) {
      console.error("identity: stored files not yet removed after Erasure; the sweep will retry", error);
    }
  }

  try {
    await identityEmails.erasureComplete(input.accountEmail);
  } catch (error) {
    console.error("identity: Erasure completion email failed", error);
  }
}

/** Deletes Accounts that never completed Verification. Not an Erasure: nothing was ever stored for them. */
export async function purgeUnverifiedAccounts(now = new Date()): Promise<number> {
  const cutoff = unverifiedCutoff(now);
  return db.transaction(async (tx) => {
    const ids = rowsOf<{ id: string }>(
      await tx.execute(sql`select "id" from "user" where "emailVerified" = false and "createdAt" < ${cutoff.toISOString()} for update`),
    ).map((row) => row.id);
    await deleteAccountRows(tx, ids);
    return ids.length;
  });
}

export async function accountEmail(accountId: AccountId): Promise<string | null> {
  const [row] = rowsOf<{ email: string }>(await db.execute(sql`select "email" from "user" where "id" = ${accountId}`));
  return row?.email ?? null;
}
