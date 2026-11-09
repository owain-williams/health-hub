/** Records domain events (ADR 0002: dispatched in-process). */
import type { PersonId } from "../identity/events";

export type RecordId = string;

/** Emitted in the transaction that creates a Record. Extraction will consume it. */
export interface RecordUploaded {
  type: "RecordUploaded";
  personId: PersonId;
  recordId: RecordId;
}

/** Emitted in the transaction that deletes a Record. Timeline and Pathways will consume it. */
export interface RecordDeleted {
  type: "RecordDeleted";
  personId: PersonId;
  recordId: RecordId;
}
