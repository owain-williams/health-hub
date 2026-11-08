import { useState, type FormEvent } from "react";
import { PASSWORD_MIN_LENGTH } from "../src/domains/identity/rules";
import { authClient, messageFor } from "../src/ui/auth/client";
import { Field, fieldOf, Notice, useHydrated } from "../src/ui/auth/Field";
import "./account.css";

type Errors = { name?: string; email?: string; password?: string; form?: string };

export default function SignupPage() {
  const hydrated = useHydrated();
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = fieldOf(event.currentTarget, "name").trim();
    const email = fieldOf(event.currentTarget, "email").trim();
    const password = fieldOf(event.currentTarget, "password");

    const found: Errors = {};
    if (!name) found.name = "Tell us what to call you.";
    if (!email) found.email = "Enter your email address.";
    if (password.length < PASSWORD_MIN_LENGTH) found.password = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setPending(true);
    try {
      const { error } = await authClient.signUp.email({ name, email, password, callbackURL: "/verify" });
      if (error) {
        const message = messageFor(error);
        if (error.code === "PASSWORD_COMPROMISED" || error.code === "PASSWORD_TOO_SHORT") setErrors({ password: message });
        else if (error.code === "INVALID_EMAIL") setErrors({ email: message });
        else setErrors({ form: message });
        return;
      }
      setSentTo(email);
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          {sentTo ? (
            <>
              <h1>Check your email</h1>
              <p className="hh-lede">
                If <strong>{sentTo}</strong> can create an account, we have sent a link to it. Open the link to confirm your email address, then sign in.
              </p>
              <p className="hh-muted">
                Health Hub is not open to everyone yet. If no email arrives within a few minutes, check your spam folder. If it is still not there, this
                address cannot create an account yet.
              </p>
              <a className="hh-btn hh-btn--secondary" href="/signin">
                Go to sign in
              </a>
            </>
          ) : (
            <>
              <h1>Create your account</h1>
              <p className="hh-lede">One account holds one person's records. You can add a passkey or an authenticator app afterwards.</p>
              {errors.form ? <Notice tone="error">{errors.form}</Notice> : null}
              <form method="post" onSubmit={submit} noValidate>
                <Field label="What should we call you?" name="name" autoComplete="name" required error={errors.name} />
                <Field label="Email address" type="email" name="email" autoComplete="email" required error={errors.email} />
                <Field
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  hint={`At least ${PASSWORD_MIN_LENGTH} characters. A few ordinary words strung together works well.`}
                  error={errors.password}
                />
                <Notice>
                  <p>
                    <strong>Keep access to this email address.</strong> If you lose it, we cannot recover your account; you would need to create a new one.
                  </p>
                </Notice>
                <div className="hh-actions">
                  <button className="hh-btn hh-btn--primary" type="submit" disabled={pending || !hydrated}>
                    {pending ? "Creating…" : "Create account"}
                  </button>
                </div>
              </form>
              <p className="hh-muted">
                Already have an account? <a href="/signin">Sign in</a>.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
