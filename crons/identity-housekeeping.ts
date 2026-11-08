/**
 * Daily Identity housekeeping:
 * - delete Accounts that never completed Verification within 7 days
 * - trim Sign-in History older than 12 months
 *
 * The orphaned-storage sweep joins this job when the Records context adds stored files.
 */
import { defineScheduled } from "void";
import { purgeUnverifiedAccounts } from "../src/application/identity/erase";
import { trimSignInHistory } from "../src/application/identity/signInHistory";

export const cron = "17 3 * * *";

export default defineScheduled(async () => {
  const purged = await purgeUnverifiedAccounts();
  const trimmed = await trimSignInHistory();
  console.log(`identity: purged ${purged} unverified Accounts, trimmed ${trimmed} Sign-in History entries`);
});
