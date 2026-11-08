# Pathways

Named threads that group related Timeline events, for example a referral, the appointment, the scan result and the follow-up letter. Records sequence only.

## Language

**Pathway**:
A named group of related Timeline Facts belonging to one Person. Shows what happened in what order; carries no overdue, next-step or urgency logic.
_Avoid_: Journey, episode, case, thread

**Outcome**:
How a Pathway ended, as a Person Statement attached to the Pathway. Never inferred by the system.
_Avoid_: Result, resolution, status

**Proposed**:
A Pathway grouping suggested by the system that the Person has not yet confirmed.
_Avoid_: Draft, suggested, pending

**Confirmed**:
A Pathway the Person has accepted as a correct grouping.
_Avoid_: Approved, accepted

**Proposed Addition**:
A system suggestion that a new Fact belongs in an existing Confirmed Pathway, awaiting the Person's decision.
_Avoid_: Suggestion, auto-add

**Manual Pathway**:
A Pathway the Person created and populated by hand. Treated like a Confirmed Pathway.
_Avoid_: Custom, user-defined

**Rejected**:
A Proposed Pathway the Person has turned down. The same grouping is not proposed again unchanged.
_Avoid_: Dismissed, declined
