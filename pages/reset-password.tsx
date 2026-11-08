import { useState, type FormEvent } from "react";
import { PASSWORD_MIN_LENGTH } from "../src/domains/identity/rules";
import { authClient, messageFor } from "../src/ui/auth/client";
import { Field, fieldOf, Notice, useHydrated } from "../src/ui/auth/Field";
import type { Props } from "./reset-password.server";
import "./account.css";

export default function ResetPasswordPage({ token, failed }: Props) {
  const hydrated = useHydrated();
  const [error, setError] = useState<string | null>(failed ? messageFor({ code: "INVALID_TOKEN" }) : null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  const request = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = fieldOf(event.currentTarget, "email").trim();
    if (!email) return setError("Enter your email address.");
    setPending(true);
    setError(null);
    try {
      const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
      if (error) return setError(messageFor(error));
      setSent(true);
    } finally {
      setPending(false);
    }
  };

  const choose = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const password = fieldOf(event.currentTarget, "password");
    if (password.length < PASSWORD_MIN_LENGTH) return setError(`Use at least ${PASSWORD_MIN_LENGTH} characters.`);
    setPending(true);
    setError(null);
    try {
      const { error } = await authClient.resetPassword({ newPassword: password, token: token ?? "" });
      if (error) return setError(messageFor(error));
      window.location.assign("/signin?reset=1");
    } finally {
      setPending(false);
    }
  };

  const busy = pending || !hydrated;

  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          <h1>{token && !failed ? "Choose a new password" : "Reset your password"}</h1>
          {error ? <Notice tone="error">{error}</Notice> : null}

          {token && !failed ? (
            <form method="post" onSubmit={choose} noValidate>
              <Field
                label="New password"
                type="password"
                name="password"
                autoComplete="new-password"
                required
                hint={`At least ${PASSWORD_MIN_LENGTH} characters. Your other sessions will be signed out.`}
              />
              <div className="hh-actions">
                <button className="hh-btn hh-btn--primary" type="submit" disabled={busy}>
                  {pending ? "Saving…" : "Save new password"}
                </button>
              </div>
            </form>
          ) : sent ? (
            <>
              <p className="hh-lede">If an account uses that address, we have sent it a link. The link works for one hour.</p>
              <a className="hh-btn hh-btn--secondary" href="/signin">
                Back to sign in
              </a>
            </>
          ) : (
            <form method="post" onSubmit={request} noValidate>
              <p className="hh-muted">Type the email address on your account and we will send you a link to choose a new password.</p>
              <Field label="Email address" type="email" name="email" autoComplete="email" required />
              <div className="hh-actions">
                <button className="hh-btn hh-btn--primary" type="submit" disabled={busy}>
                  {pending ? "Sending…" : "Send link"}
                </button>
                <a href="/signin">Back to sign in</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
