/**
 * In-process domain event dispatch (ADR 0002).
 *
 * Handlers run inside the caller's transaction and receive it, so a failing
 * handler fails the whole operation. Contexts register their handlers in
 * `src/application/handlers.ts`.
 */
import type { PersonCreated, PersonErased } from "../domains/identity/events";
import type { RecordDeleted, RecordUploaded } from "../domains/records/events";
import type { Tx } from "./db";

export type DomainEvent = PersonCreated | PersonErased | RecordUploaded | RecordDeleted;
type Handler<E extends DomainEvent> = (event: E, tx: Tx) => Promise<void>;

const handlers: { [K in DomainEvent["type"]]?: Handler<Extract<DomainEvent, { type: K }>>[] } = {};

export function on<K extends DomainEvent["type"]>(type: K, handler: Handler<Extract<DomainEvent, { type: K }>>): void {
  const list = (handlers[type] ??= []) as Handler<Extract<DomainEvent, { type: K }>>[];
  list.push(handler);
}

export async function dispatch(event: DomainEvent, tx: Tx): Promise<void> {
  const list = (handlers[event.type] ?? []) as Handler<typeof event>[];
  for (const handler of list) await handler(event, tx);
}
