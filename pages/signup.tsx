import "./account.css";

export default function SignupPage() {
  return (
    <section className="hh-account">
      <div className="hh-container hh-account__wrap">
        <div className="hh-panel hh-account__panel">
          <h1>Create your account</h1>
          <p className="hh-lede">
            Health Hub is still being built. Account creation is not open yet, so there is nothing to fill in here today.
          </p>
          <p className="hh-muted">
            When it opens, this is where you will set up the account that holds your records. Until then, you can read about{" "}
            <a href="/#how-it-works">how Health Hub works</a> and <a href="/#never">what it never does</a>.
          </p>
          <a className="hh-btn hh-btn--secondary" href="/">Back to the front page</a>
        </div>
      </div>
    </section>
  );
}
