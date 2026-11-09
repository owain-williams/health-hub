# Identity

## Purpose

Identity decides who can sign in and which Person each request acts on. It separates the Account (who signs in) from the Person (whose records these are) so that Sharing and carers can later be added at one seam. It must never give one Account access to a Person it does not hold, and never keep anything about an Account after Erasure.

Authentication is Void-managed Better Auth (ADR 0003). Auth data lives in the UK/EU database; auth emails carry no health data (ADR 0001).

## Glossary

[`src/domains/identity/GLOSSARY.md`](../../src/domains/identity/GLOSSARY.md). Terms used exactly: Account, Person, Holds, Verification, Recent Sign-in, Sign-in History, Allowlist, Erasure, Access Log.

## Invariants

- An Account holds exactly one Person in v1. The Person is created at sign-up; if that fails, the new Account is deleted and sign-up fails, so an Account never persists without its Person (ADR 0003).
- An Account is Better Auth's `user`; `AccountId` is `user.id`. Better Auth's `account` table is not an Account and never appears in domain code or UI copy.
- Every signed-in request resolves its Person once, at the edge, by following Holds from the session's Account. Use cases take a `PersonId` only, never an `AccountId`, a session, or a Person id from the URL or body.
- There are no roles in v1: no admin, no support, no staff access to any Person's data.
- Every page and `/api/*` route requires sign-in, except: `/`, `/signin`, `/signup`, `/verify`, `/reset-password`, `/api/auth/*`, and static or brand assets. One middleware enforces this. Signed-out visitors are redirected to `/signin?next=…`; `next` must be a same-origin path.
- An Account cannot sign in until Verification is complete.
- Unverified Accounts, and their empty Persons, are deleted 7 days after sign-up.
- Sign-in methods are email and password, plus optional passkeys. No social or magic-link sign-in.
- TOTP second factor is optional and encouraged after sign-up. Turning it on shows backup codes once. A passkey may stand in as the second factor.
- Passwords are at least 12 characters, have no composition rules, and are rejected if found in a breached-password check (k-anonymous hash prefix only).
- No Account lockout. Auth rate limits are shared across Worker instances (database storage). Failed attempts are recorded in Sign-in History.
- Sessions expire after 12 hours idle and 7 days absolute. No "remember me".
- Erasure, changing email or password, and removing a second factor or passkey require a Recent Sign-in (within 5 minutes).
- Changing the password signs out every other session.
- While sign-up is closed, only Allowlist addresses can create an Account. A rejected sign-up shows the same neutral "sign-up isn't open yet" message whether or not the address exists anywhere.
- Sign-in History is kept for a rolling 12 months.
- Auth and security emails are plain, contain no health data, and never mention Records, uploads or Extraction.
- There is no recovery for an Account whose email is lost; sign-up says so plainly.
- Erasure is immediate and irreversible. It removes the Account, its Person, everything belonging to the Person in every context, all stored files under the Person's storage prefix, the Access Log and Sign-in History. Only an anonymous count of Erasures by date survives.

## Use cases

- **Sign up**: a visitor gives one name ("What should we call you?", required free text), email and password. Checks the Allowlist, creates the Account and its Person (both named from the one field), sends a Verification email.
- **Verify email**: the visitor follows the Verification link; the Account can now sign in.
- **Sign in**: email and password, or passkey; then TOTP if enabled. Records the attempt in Sign-in History.
- **Sign out**: ends the current session.
- **List and revoke sessions**: the Account sees active sessions (device, approximate time) and can sign out one or every other session.
- **Reset password**: by emailed link; signs out every other session; emails the Account.
- **Change password**: needs a Recent Sign-in; signs out every other session; emails the Account.
- **Change email**: needs a Recent Sign-in; the new address is verified; both old and new addresses are told.
- **Add or remove a passkey**: removing needs a Recent Sign-in; either change emails the Account.
- **Turn TOTP on or off**: on shows backup codes once; off needs a Recent Sign-in; either change emails the Account.
- **View Sign-in History**: the Account sees its last 12 months of sign-ins, failed attempts and credential changes.
- **Erase**: needs a Recent Sign-in, a screen stating exactly what will be deleted, and typing the Account's email. Deletes all database data in one transaction, then the Person's storage prefix, then sends a completion email.
- **Manage Allowlist**: an operator adds or removes addresses with a CLI script. No UI.
- **Purge unverified Accounts**: a scheduled sweep deletes Accounts unverified after 7 days.
- **Sweep orphaned storage**: a scheduled sweep, on the daily housekeeping cron, deletes stored Record files that no Record holds, once they are over an hour old. Records owns it (`docs/specs/records.md`). Erasure removes the Person's storage prefix through Records' `PageStore`, which implements the `PersonFiles` port.

## Events in

None in v1.

## Events out

- **PersonCreated** (`PersonId`): on sign-up. No consumer yet.
- **PersonErased** (`PersonId`): inside the Erasure transaction. Every context deletes its rows for that Person (ADR 0002: in-process, same transaction).

## Out of scope

- Social sign-in, magic links, SSO.
- Mandatory second factor.
- Account lockout.
- Admin, support or staff roles; manual Account recovery.
- An Erasure grace period or undo.
- More than one Person per Account; Sharing; carers.
- Allowlist UI.

## Open questions

- Production sender for auth emails (`EMAIL_FROM`, a domain the Cloudflare account can send from): owner, before launch.
- The breached-password check runs only for Allowlisted addresses, so a breached password gets an error for an Allowlisted address and the neutral reply otherwise. Accepted for the closed beta; it goes away when the Allowlist is removed.

- When sign-up opens and the Allowlist is removed: owner, at launch.
- Wording and placement of the "add a passkey or second factor" prompt after sign-up: design.
