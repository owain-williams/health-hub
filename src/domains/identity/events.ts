/** Identity domain events (ADR 0002: dispatched in-process). */

export type PersonId = string;
export type AccountId = string;

export interface PersonCreated {
  type: "PersonCreated";
  personId: PersonId;
}

/** Emitted inside the Erasure transaction. Every context deletes its rows for the Person. */
export interface PersonErased {
  type: "PersonErased";
  personId: PersonId;
  accountId: AccountId;
}
