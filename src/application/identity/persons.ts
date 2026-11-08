import { allowlist, persons } from "@schema";
import { db, eq } from "void/db";
import type { AccountId, PersonId } from "../../domains/identity/events";
import { normaliseEmail, normaliseName } from "../../domains/identity/rules";
import { dispatch } from "../events";

export interface Person {
  id: PersonId;
  name: string;
}

/** Creates the Account's Person. Called once, at sign-up. */
export async function createPersonForAccount(accountId: AccountId, name: string): Promise<Person> {
  return db.transaction(async (tx) => {
    const [person] = await tx
      .insert(persons)
      .values({ accountId, name: normaliseName(name) })
      .returning({ id: persons.id, name: persons.name });
    await dispatch({ type: "PersonCreated", personId: person.id }, tx);
    return person;
  });
}

/** Follows Holds from an Account to its Person. */
export async function personHeldBy(accountId: AccountId): Promise<Person | null> {
  const [person] = await db
    .select({ id: persons.id, name: persons.name })
    .from(persons)
    .where(eq(persons.accountId, accountId))
    .limit(1);
  return person ?? null;
}

export async function isAllowlisted(email: string): Promise<boolean> {
  const [row] = await db
    .select({ email: allowlist.email })
    .from(allowlist)
    .where(eq(allowlist.email, normaliseEmail(email)))
    .limit(1);
  return Boolean(row);
}
