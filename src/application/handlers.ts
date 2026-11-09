/**
 * Domain event handlers, registered once on import (ADR 0002). Import this
 * module from any use case that dispatches events other contexts handle.
 */
import { drizzleRecordRepository, type Executor } from "../../db/records/recordRepository";
import { on } from "./events";

// Records: delete the Person's Records inside the Erasure transaction, before
// the Person row goes. Their files are removed after commit through `PersonFiles`.
on("PersonErased", async (event, tx) => {
  await drizzleRecordRepository(tx as unknown as Executor).removeAllFor(event.personId);
});
