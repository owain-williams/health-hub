import { EmailSection, EraseSection, HistorySection, PasskeysSection, PasswordSection, SessionsSection } from "../src/ui/account/sections";
import { TwoFactorSection } from "../src/ui/account/TwoFactorSection";
import type { Props } from "./account.server";
import "./account.css";

export default function AccountPage(props: Props) {
  return (
    <section className="hh-settings">
      <div className="hh-container hh-settings__wrap">
        <header>
          <h1>Your account</h1>
          <p className="hh-lede">
            Signed in as {props.account.name}. This account holds the records of <strong>{props.personName}</strong>.
          </p>
        </header>
        <SessionsSection sessions={props.sessions} />
        <PasskeysSection passkeys={props.passkeys} />
        <TwoFactorSection enabled={props.account.twoFactorEnabled} />
        <PasswordSection />
        <EmailSection email={props.account.email} />
        <HistorySection history={props.history} />
        <EraseSection email={props.account.email} recentSignIn={props.recentSignIn} />
      </div>
    </section>
  );
}
