/**
 * Daily Identity housekeeping:
 * - delete Accounts that never completed Verification within 7 days
 * - trim Sign-in History older than 12 months
 *
 * - sweep stored Record files that no Record holds (left by a failed removal after Deletion or Erasure)
 */
import { defineScheduled } from "void";
import { purgeUnverifiedAccounts } from "../src/application/identity/erase";
import { trimSignInHistory } from "../src/application/identity/signInHistory";
import { recordsService } from "../src/application/records/live";

export const cron = "17 3 * * *";

export default defineScheduled(async () => {
  const purged = await purgeUnverifiedAccounts();
  const trimmed = await trimSignInHistory();
  console.log(`identity: purged ${purged} unverified Accounts, trimmed ${trimmed} Sign-in History entries`);
  const swept = await recordsService.sweep();
  console.log(`records: swept ${swept} orphaned Record folders`);
});
