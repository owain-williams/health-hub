# Identity

Who can log in, and whose records they hold. Separates the login identity from the subject of the records so that one human can later hold records for another.

## Language

**Account**:
The login identity. Has a verified email address and its own name, used to greet whoever signs in. An Account holds exactly one Person in v1, created with the Account; an Account never exists without its Person.
_Avoid_: User, login, profile

**Person**:
The human whose records these are. Has its own name, which starts as the Account's name and may later differ. Every Record, Fact, Conversation and Pathway belongs to one Person.
_Avoid_: Patient, user, subject, owner

**Holds**:
The relationship between an Account and the Person it acts for. Every request acts on exactly one Person, reached through Holds; nothing names a Person directly.
_Avoid_: Owns, manages, has access to

**Verification**:
Proving an Account controls its email address. An Account cannot sign in until it is verified.
_Avoid_: Confirmation, activation

**Recent Sign-in**:
A sign-in within the last few minutes. Sensitive actions (Erasure, changing email or password, removing a second factor or passkey) require one.
_Avoid_: Re-auth, sudo mode, step-up

**Sign-in History**:
The Account's own list of sign-ins, failed attempts and credential changes, visible to the Account. Separate from the Access Log.
_Avoid_: Login log, security log, Access Log

**Allowlist**:
The email addresses permitted to create an Account while sign-up is closed.
_Avoid_: Waitlist, invite list, beta list

**Erasure**:
Deleting an Account. Removes its Person and everything that belongs to the Person in every context, including stored files, the Access Log and Sign-in History, with no retention window. Only the fact that an Erasure happened on a date survives, with no identifiers.
_Avoid_: Deactivation, close account, soft delete

**Access Log**:
An append-only record of every read of a Record, Fact or Answer, attributed to the Account that read it. Sign-ins are not reads; they belong in Sign-in History.
_Avoid_: Audit trail, activity, history
