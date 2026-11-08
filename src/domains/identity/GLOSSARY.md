# Identity

Who can log in, and whose records they hold. Separates the login identity from the subject of the records so that one human can later hold records for another.

## Language

**Account**:
The login identity. An Account holds exactly one Person in v1.
_Avoid_: User, login, profile

**Person**:
The human whose records these are. Every Record, Fact, Conversation and Pathway belongs to one Person.
_Avoid_: Patient, user, subject, owner

**Erasure**:
Deleting an Account. Removes its Person and everything that belongs to the Person in every context, including stored files, with no retention window.
_Avoid_: Deactivation, close account, soft delete

**Access Log**:
An append-only record of every read of a Record, Fact or Answer, attributed to the Account that read it.
_Avoid_: Audit trail, activity, history
