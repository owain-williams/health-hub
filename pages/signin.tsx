import "./account.css";

export default function SigninPage() {
  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          <h1>Sign in</h1>
          <p className="hh-lede">
            Health Hub is still being built. Sign-in is not open yet because no accounts exist.
          </p>
          <p className="hh-muted">
            When accounts open, this page will sign you in. Until then, the <a href="/">front page</a> explains what Health Hub does.
          </p>
          <a className="hh-btn hh-btn--secondary" href="/">Back to the front page</a>
        </div>
      </div>
    </section>
  );
}
