# Records

The documents a Person supplies and the statements they write, kept exactly as given. Nothing enters Health Hub any other way in v1.

## Language

**Record**:
One document supplied by a Person, or one Person Statement. Immutable; a corrected version is a new Record.
_Avoid_: Document, file, upload, source

**Kind**:
What sort of Record it is: clinic letter, discharge summary, test result, prescription, imaging report, Person Statement, or other. Set by extraction, correctable by the Person, except Person Statement which is fixed.
_Avoid_: Type, category, document type

**Person Statement**:
A Record the Person wrote in their own words, with the date they wrote it. Used when a document is lost or something was never written down. Facts lifted from it are always shown as the Person's own account.
_Avoid_: Note, manual entry, user fact

**Record Date**:
The date the document itself carries, such as the letter date or report date. Set by extraction, correctable by the Person. Undated Facts fall back to it.
_Avoid_: Document date, created at, upload date

**Original Name**:
The file name a Record arrived with, kept exactly as given. Labels the Record until it has a Kind and Record Date. Photos have none.
_Avoid_: Filename, title

**Upload**:
The act of a Person supplying a Record as a PDF or one or more photos of paper pages. Produces one Record and starts extraction, unless the Person already has a Record with identical content, in which case nothing new is created.
_Avoid_: Import, ingest

**Page**:
One page of a Record, either a PDF page or one photo. The unit a Source points into and a Partial Run reports on.
_Avoid_: Image, scan

**Deletion**:
A Person removing a Record. Removes everything derived from it in every other context.
_Avoid_: Archive, hide
