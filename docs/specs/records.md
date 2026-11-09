# Records

## Purpose

Records keeps the documents a Person supplies, exactly as given, and is the only way anything enters Health Hub in v1. It stores each Record's Pages, lists and shows them back to the Person, and removes them on Deletion or Erasure. It must never alter a Record's content, read meaning into it, or let one Person reach another Person's Records.

Use cases depend on two ports, `RecordRepository` and `PageStore`, each with a real adapter (Drizzle, R2) and an in-memory adapter for tests (ADR 0004).

## Glossary

[`src/domains/records/GLOSSARY.md`](../../src/domains/records/GLOSSARY.md). Terms used exactly: Record, Kind, Person Statement, Record Date, Original Name, Upload, Page, Deletion.

## Invariants

- Every Record belongs to exactly one Person. Every read, list, Page fetch and Deletion is scoped by `PersonId`. Asking for another Person's Record behaves exactly as if it does not exist.
- A Record is immutable once created: its Pages, Original Name and content hash never change.
- An Upload is either one PDF, or 1 to 30 photos, never a mix.
- An Upload's file types are decided from each file's leading bytes (`%PDF-`, JPEG `FF D8 FF`, PNG `89 50 4E 47 0D 0A 1A 0A`), never from the browser's file name or MIME type. Anything else is rejected, HEIC included.
- Size limits: a PDF is at most 25 MB; a photo at most 15 MB; one Upload at most 100 MB in total. Empty files are rejected.
- A Person can make at most 30 Uploads in any rolling hour.
- A PDF Record has one stored file. A photo Record has one stored file per photo, in the order the Person gave. Photos are never re-encoded.
- An Upload's content hash is SHA-256 over its files' bytes in order. If the Person already has a Record with that hash, no new Record is created and the existing Record is returned as a duplicate.
- Upload asks for nothing but the files. Kind and Record Date start empty and are never set by Records in this slice.
- A Record row never points at files that do not exist: Pages are stored before the Record is inserted. If inserting fails, the stored files are deleted, and the sweep removes any that remain.
- `RecordUploaded` is emitted in the same transaction that inserts the Record. `RecordDeleted` is emitted in the same transaction that deletes it.
- Deletion is a hard delete. The Record's files are removed after commit; a failure there is left to the sweep and does not fail the Deletion.
- On `PersonErased`, every Record row for that Person is deleted inside the Erasure transaction. Their files are removed after commit by Identity's `PersonFiles` port, which `PageStore` implements.
- Stored files live under `persons/<PersonId>/records/<RecordId>/`. Storage is R2 with EU jurisdiction (ADR 0001).
- Pages are served only to the signed-in Person who holds the Record, with `X-Content-Type-Options: nosniff`, `Cache-Control: private, no-store`, `Content-Security-Policy: sandbox` and the stored content type.
- A Record's label is its Kind and Record Date when both are known, else its Original Name, else "Photos, N pages".
- The Records list shows newest Upload first.
- The sweep only deletes files older than 1 hour, so it never touches an Upload still in progress.

## Use cases

- **Upload**: the Person, from `/records/new`, supplies one PDF or 1 to 30 photos. Validates types, sizes and rate; hashes; returns the existing Record if it is a duplicate; otherwise stores the Pages, inserts the Record and emits `RecordUploaded`. Outcome: the new or existing Record's id, and whether it was a duplicate.
- **List Records**: the Person sees every Record they hold, newest first, each with label, upload date and "Not read yet".
- **View Record**: the Person sees one Record: its label, upload date, Original Name and its Pages.
- **Read Page**: the Person's browser fetches Page `n` of a Record they hold. Images display inline; a PDF opens inline in the browser's viewer.
- **Delete Record**: the Person confirms Deletion. Deletes the Record row and emits `RecordDeleted` in one transaction, then deletes the Record's files.
- **Sweep orphaned storage**: a scheduled job, on the existing housekeeping cron. Deletes any `persons/<PersonId>/` prefix with no matching Person, and any `persons/<PersonId>/records/<RecordId>/` folder with no Record row, touching only files older than 1 hour.

## Events in

- **PersonErased** (Identity): delete every Record row for the Person, in the Erasure transaction.

## Events out

- **RecordUploaded** (`PersonId`, `RecordId`): when a new Record is created. Extraction will consume it; no consumer yet.
- **RecordDeleted** (`PersonId`, `RecordId`): when a Record is deleted. Timeline and Pathways will consume it; no consumer yet.

## Out of scope

- Person Statements (a later slice).
- The Person correcting Kind or Record Date (needs Extraction first).
- Kind or Record Date entered at Upload.
- HEIC, TIFF, Word documents, or any format other than PDF, JPEG and PNG.
- Mixing a PDF and photos in one Upload; several Records in one Upload.
- Splitting, counting or parsing PDF pages at Upload; a PDF's page count is unknown until Extraction.
- Re-encoding, resizing or rotating photos.
- Soft delete, archive, or undo of Deletion.
- A total storage quota per Person.
- Search or filters on the Records list.

## Open questions

- Whether the R2 bucket must be created by hand with EU jurisdiction before first deploy, or Void provisions it. Checked at first deploy.
