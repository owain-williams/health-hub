# Glossary Map

Health Hub is a patient-facing hub for a person's own medical records. It presents what the records say, with every statement traceable to the document it came from. It never diagnoses, judges urgency, or suggests clinical action.

## Contexts

- [Identity](./src/domains/identity/GLOSSARY.md): who logs in and whose records they hold
- [Records](./src/domains/records/GLOSSARY.md): the documents a Person supplies and the statements they write, kept as given
- [Extraction](./src/domains/extraction/GLOSSARY.md): turning a Record into candidate Facts
- [Timeline](./src/domains/timeline/GLOSSARY.md): the Person's Facts, in time order, as the Records state them
- [Q&A](./src/domains/qa/GLOSSARY.md): questions asked against a Person's Facts, answered only from cited Facts
- [Pathways](./src/domains/pathways/GLOSSARY.md): named threads grouping related Timeline events, confirmed by the Person

## Future contexts (named, not modelled)

- **Sharing**: a Person letting a relative or clinician see a view of their records, with its own consent rules
- **Integrations**: live feeds from NHS App, GP Connect or similar, as an ingestion channel alongside Upload

## Relationships

- **Identity → everything**: every context scopes its data to a Person; Identity owns `PersonId` and `AccountId`
- **Records → Extraction**: a Record upload starts an Extraction Run; Extraction never changes a Record
- **Extraction → Timeline**: a completed, current Run hands its Facts to Timeline; Timeline is the only owner of Facts
- **Records → Timeline, Pathways**: deleting a Record removes its Facts and their Pathway memberships
- **Records → Q&A**: deleting a Record leaves Answers in place; their citations to it read as "Record deleted"
- **Timeline → Q&A**: Q&A reads Facts from Timeline, never from Extraction
- **Timeline → Pathways**: Pathways group Timeline events; they hold references, not copies; one Fact may sit in many Pathways
- **Timeline → Q&A (over time)**: an Answer is a snapshot; a later Disputed mark or Record deletion is shown on its citations, never rewritten away

## Layout

- `src/domains/<context>/`: entities, rules, `GLOSSARY.md`, context-specific `docs/adr/`
- `src/application/<context>/`: use cases orchestrating the domain
- `pages/`, `routes/`: delivery adapters; `db/`: persistence adapter
- `docs/adr/`: system-wide decisions; `docs/specs/`: one spec per context (see `docs/specs/README.md`)
