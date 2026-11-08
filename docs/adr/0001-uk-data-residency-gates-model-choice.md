---
status: accepted
---

# UK data residency gates the whole stack, not only model choice

Health Hub holds a Person's medical records and sends them to AI models for Extraction and Q&A. All of it must stay within the UK, or at minimum the EU: the Postgres database, R2 object storage (EU jurisdiction setting), and any AI provider used for Extraction or Q&A, which must also not train on inputs. Cloudflare Workers AI is not used by default because its models run wherever Cloudflare routes them. AI candidates that cannot meet this are excluded before any side-by-side evaluation; the remaining candidates are chosen by running them on the same real inputs and comparing results, not from comparison research up front.

## Consequences

- Some well-known models and the default Workers AI route are unavailable regardless of quality or price.
- Residency and no-training terms are checked and recorded per provider before an evaluation is run.
- Storage and database jurisdiction are set at provisioning time and must not be changed casually.
- Account authentication data (Better Auth tables) lives in the same Postgres database and is covered by this decision. Auth emails (Verification, password reset) may be delivered by a sender outside the UK/EU because they carry only an email address and a link: no health data, and no mention of Records, uploads or Extraction.
