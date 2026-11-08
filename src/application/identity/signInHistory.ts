import { signInEvents } from "@schema";
import { and, db, desc, eq, gte, lt } from "void/db";
import type { AccountId } from "../../domains/identity/events";
import { describeDevice, signInHistoryCutoff, type SignInEventKind } from "../../domains/identity/rules";

export async function recordSignInEvent(accountId: AccountId, kind: SignInEventKind, userAgent: string | null | undefined): Promise<void> {
  await db.insert(signInEvents).values({ accountId, kind, device: describeDevice(userAgent) });
}

export async function listSignInHistory(accountId: AccountId, now = new Date()) {
  return db
    .select({ id: signInEvents.id, kind: signInEvents.kind, device: signInEvents.device, occurredAt: signInEvents.occurredAt })
    .from(signInEvents)
    .where(and(eq(signInEvents.accountId, accountId), gte(signInEvents.occurredAt, signInHistoryCutoff(now))))
    .orderBy(desc(signInEvents.occurredAt))
    .limit(200);
}

export async function trimSignInHistory(now = new Date()): Promise<number> {
  const removed = await db.delete(signInEvents).where(lt(signInEvents.occurredAt, signInHistoryCutoff(now))).returning({ id: signInEvents.id });
  return removed.length;
}
