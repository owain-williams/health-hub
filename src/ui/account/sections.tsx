import { action, Form, useForm } from "@void/react";
import { useState, type FormEvent } from "react";
import { PASSWORD_MIN_LENGTH } from "../../domains/identity/rules";
import type { Props } from "../../../pages/account.server";
import { authClient } from "../auth/client";
import { Field, fieldOf, Notice, useHydrated } from "../auth/Field";
import { formatWhen, Section, useAuthTask } from "./shared";

export function SessionsSection({ sessions }: { sessions: Props["sessions"] }) {
  const { run, pending, feedback } = useAuthTask();
  const others = sessions.filter((s) => !s.current).length;

  const revoke = (sessionId: string) =>
    run(async () => {
      const result = await action("/account?revokeSession", { data: { sessionId } });
      if (!result.ok) return { error: { message: result.error.message } };
    }, "That session has been signed out.");

  const revokeOthers = () =>
    run(async () => {
      const result = await action("/account?revokeOtherSessions", {});
      if (!result.ok) return { error: { message: result.error.message } };
    }, "Every other session has been signed out.");

  const signOut = () =>
    run(async () => {
      await authClient.signOut();
      window.location.assign("/");
    });

  return (
    <Section title="Where you are signed in">
      {feedback}
      <ul className="hh-list">
        {sessions.map((s) => (
          <li key={s.id}>
            <div>
              <strong>{s.device}</strong>
              {s.current ? " (this device)" : null}
              <div className="hh-list__meta">
                Signed in {formatWhen(s.signedInAt)}. Last used {formatWhen(s.lastUsedAt)}.
              </div>
            </div>
            {s.current ? (
              <button className="hh-btn hh-btn--secondary" type="button" onClick={signOut} disabled={pending}>
                Sign out
              </button>
            ) : (
              <button className="hh-btn hh-btn--quiet" type="button" onClick={() => revoke(s.id)} disabled={pending}>
                Sign out<span className="hh-visually-hidden"> {s.device}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
      {others > 0 ? (
        <div className="hh-actions">
          <button className="hh-btn hh-btn--secondary" type="button" onClick={revokeOthers} disabled={pending}>
            Sign out everywhere else
          </button>
        </div>
      ) : null}
    </Section>
  );
}

export function PasskeysSection({ passkeys }: { passkeys: Props["passkeys"] }) {
  const { run, pending, feedback } = useAuthTask();

  const add = () =>
    run(async () => {
      const result = await authClient.passkey.addPasskey({ name: guessDeviceName() });
      if (result?.error) return { error: result.error };
    }, "Passkey added. You can now sign in with it instead of your password.");

  const remove = (id: string) => run(() => authClient.passkey.deletePasskey({ id }), "Passkey removed.");

  return (
    <Section title="Passkeys">
      <p className="hh-muted">
        A passkey lets you sign in with your fingerprint, face or device PIN instead of typing your password. It stays on your device and cannot be
        guessed or reused elsewhere.
      </p>
      {feedback}
      {passkeys.length > 0 ? (
        <ul className="hh-list">
          {passkeys.map((p) => (
            <li key={p.id}>
              <div>
                <strong>{p.name}</strong>
                {p.addedAt ? <div className="hh-list__meta">Added {formatWhen(p.addedAt)}</div> : null}
              </div>
              <button className="hh-btn hh-btn--quiet" type="button" onClick={() => remove(p.id)} disabled={pending}>
                Remove<span className="hh-visually-hidden"> {p.name}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="hh-actions">
        <button className="hh-btn hh-btn--primary" type="button" onClick={add} disabled={pending}>
          Add a passkey
        </button>
      </div>
    </Section>
  );
}

function guessDeviceName(): string {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) return "Android device";
  if (/Mac/.test(ua)) return "Mac";
  if (/Windows/.test(ua)) return "Windows computer";
  return "Passkey";
}

export function PasswordSection() {
  const hydrated = useHydrated();
  const { run, pending, feedback, setError } = useAuthTask();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const currentPassword = fieldOf(form, "currentPassword");
    const newPassword = fieldOf(form, "newPassword");
    if (newPassword.length < PASSWORD_MIN_LENGTH) return setError(`Use at least ${PASSWORD_MIN_LENGTH} characters for the new password.`);
    void run(async () => {
      const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (result.error) return { error: result.error };
      form.reset();
    }, "Password changed. Every other session has been signed out.");
  };

  return (
    <Section title="Password">
      {feedback}
      <form method="post" onSubmit={submit} noValidate>
        <Field label="Current password" type="password" name="currentPassword" autoComplete="current-password" required />
        <Field label="New password" type="password" name="newPassword" autoComplete="new-password" required hint={`At least ${PASSWORD_MIN_LENGTH} characters.`} />
        <div className="hh-actions">
          <button className="hh-btn hh-btn--primary" type="submit" disabled={pending || !hydrated}>
            Change password
          </button>
        </div>
      </form>
    </Section>
  );
}

export function EmailSection({ email }: { email: string }) {
  const hydrated = useHydrated();
  const { run, pending, feedback, setError } = useAuthTask();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const newEmail = fieldOf(form, "newEmail").trim();
    if (!newEmail) return setError("Enter the new email address.");
    void run(async () => {
      const result = await authClient.changeEmail({ newEmail, callbackURL: "/account" });
      if (result.error) return { error: result.error };
      form.reset();
    }, `We have sent a link to ${email}. Open it to approve the change; we will then send a link to the new address to confirm it.`);
  };

  return (
    <Section title="Email address">
      <p>
        Your email address is <strong>{email}</strong>.
      </p>
      {feedback}
      <form method="post" onSubmit={submit} noValidate>
        <Field label="New email address" type="email" name="newEmail" autoComplete="email" required />
        <div className="hh-actions">
          <button className="hh-btn hh-btn--secondary" type="submit" disabled={pending || !hydrated}>
            Change email address
          </button>
        </div>
      </form>
    </Section>
  );
}

export function HistorySection({ history }: { history: Props["history"] }) {
  return (
    <Section title="Sign-in History">
      <p className="hh-muted">Sign-ins, failed attempts and changes to how you sign in, for the last 12 months.</p>
      {history.length === 0 ? (
        <p>Nothing yet.</p>
      ) : (
        <ul className="hh-list">
          {history.map((h) => (
            <li key={h.id}>
              <div>
                <strong>{h.what}</strong>
                <div className="hh-list__meta">
                  {formatWhen(h.at)}. {h.device}.
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}

export function EraseSection({ email, recentSignIn }: { email: string; recentSignIn: boolean }) {
  const [open, setOpen] = useState(false);
  const form = useForm("/account?erase", { confirmEmail: "" });

  return (
    <Section title="Delete your account" danger>
      <p>
        Deleting your account removes everything Health Hub holds for you: your records, the facts taken from them, your questions and answers, your
        pathways, your Sign-in History and every stored file. Nothing is kept, and it cannot be undone.
      </p>
      {!open ? (
        <div className="hh-actions">
          <button className="hh-btn hh-btn--secondary" type="button" onClick={() => setOpen(true)}>
            Delete my account…
          </button>
        </div>
      ) : !recentSignIn ? (
        <Notice>
          <p>For your safety, sign in again first. Then come back here to delete your account.</p>
          <p>
            <a href="/signin?reauth=1&next=%2Faccount">Sign in again</a>
          </p>
        </Notice>
      ) : (
        <Form form={form}>
          <Field
            label={`To confirm, type your email address (${email})`}
            type="email"
            autoComplete="off"
            required
            name="confirmEmail"
            value={form.data.confirmEmail}
            error={form.errors.confirmEmail}
            onChange={(e) => form.setData("confirmEmail", e.target.value)}
          />
          <div className="hh-actions">
            <button className="hh-btn hh-btn--danger" type="submit" disabled={form.pending}>
              {form.pending ? "Deleting…" : "Delete my account and everything in it"}
            </button>
            <button className="hh-btn hh-btn--quiet" type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Section>
  );
}
