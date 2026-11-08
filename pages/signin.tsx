import { useState, type FormEvent } from "react";
import { authClient, messageFor } from "../src/ui/auth/client";
import { Field, fieldOf, Notice, useHydrated } from "../src/ui/auth/Field";
import type { Props } from "./signin.server";
import "./account.css";

type Step = "password" | "code" | "backup";

export default function SigninPage({ next, reauth, reset }: Props) {
  const hydrated = useHydrated();
  const [step, setStep] = useState<Step>("password");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const finish = () => window.location.assign(next);

  async function run(task: () => Promise<void>) {
    setPending(true);
    setError(null);
    try {
      await task();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  const submitPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = fieldOf(event.currentTarget, "email").trim();
    const password = fieldOf(event.currentTarget, "password");
    if (!email || !password) return setError("Enter your email address and password.");
    void run(async () => {
      const { data, error } = await authClient.signIn.email({ email, password, callbackURL: "/verify" });
      if (error) return setError(messageFor(error));
      if (data && "twoFactorRedirect" in data && data.twoFactorRedirect) {
        setStep("code");
        return;
      }
      finish();
    });
  };

  const submitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = fieldOf(event.currentTarget, "code");
    void run(async () => {
      const result =
        step === "code"
          ? await authClient.twoFactor.verifyTotp({ code: code.replace(/\s/g, "") })
          : await authClient.twoFactor.verifyBackupCode({ code: code.trim() });
      if (result.error) return setError(messageFor(result.error));
      finish();
    });
  };

  const usePasskey = () =>
    void run(async () => {
      const result = await authClient.signIn.passkey();
      if (result?.error) return setError(messageFor(result.error));
      finish();
    });

  const busy = pending || !hydrated;

  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          <h1>{step === "password" ? "Sign in" : "Check it's you"}</h1>

          {reauth && step === "password" ? (
            <Notice>For your safety, sign in again before changing your account's security settings.</Notice>
          ) : null}
          {reset && step === "password" ? <Notice tone="success">Your password has been changed. Sign in with the new one.</Notice> : null}
          {error ? <Notice tone="error">{error}</Notice> : null}

          {step === "password" ? (
            <>
              <form method="post" onSubmit={submitPassword} noValidate>
                <Field label="Email address" type="email" name="email" autoComplete="username webauthn" required />
                <Field label="Password" type="password" name="password" autoComplete="current-password" required />
                <div className="hh-actions">
                  <button className="hh-btn hh-btn--primary" type="submit" disabled={busy}>
                    {pending ? "Signing in…" : "Sign in"}
                  </button>
                  <a href="/reset-password">Forgotten your password?</a>
                </div>
              </form>
              <p className="hh-divider">or</p>
              <button className="hh-btn hh-btn--secondary" type="button" onClick={usePasskey} disabled={busy}>
                Sign in with a passkey
              </button>
              <p className="hh-muted">
                New to Health Hub? <a href="/signup">Create an account</a>.
              </p>
            </>
          ) : (
            <form method="post" onSubmit={submitCode} noValidate key={step}>
              {step === "code" ? (
                <Field
                  label="Code from your authenticator app"
                  hint="Open the app you set up for Health Hub and type the 6-digit code it shows."
                  name="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                />
              ) : (
                <Field
                  label="Backup code"
                  hint="One of the codes you saved when you turned on the authenticator app. Each works once."
                  name="code"
                  autoComplete="off"
                  required
                />
              )}
              <div className="hh-actions">
                <button className="hh-btn hh-btn--primary" type="submit" disabled={busy}>
                  {pending ? "Checking…" : "Continue"}
                </button>
                <button
                  className="hh-btn hh-btn--quiet"
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep(step === "code" ? "backup" : "code");
                  }}
                >
                  {step === "code" ? "Use a backup code instead" : "Use the authenticator app instead"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
