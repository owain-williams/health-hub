/**
 * Auth and security emails. Plain text only. They never carry health data and
 * never mention Records, uploads or Extraction (ADR 0001).
 */
import { sendEmail } from "void/email";
import { env } from "void/env";

const SIGN_OFF = "\n\nHealth Hub\nIf you did not expect this email, you can ignore it, or sign in and check your Sign-in History.";

async function send(to: string, subject: string, body: string): Promise<void> {
  const result = await sendEmail({ ...(env.EMAIL_FROM ? { from: env.EMAIL_FROM } : {}), to, subject, text: body + SIGN_OFF });
  if (!result.ok) {
    const detail = "error" in result ? result.error.code : result.deliveries.find((d) => !d.ok)?.error.code;
    console.error(`identity: email "${subject}" was not sent (${detail ?? "unknown"})`);
    throw new Error("The email could not be sent. Please try again in a few minutes.");
  }
}

export const identityEmails = {
  verification: (to: string, url: string) =>
    send(to, "Confirm your email address", `Open this link to confirm your email address for Health Hub:\n\n${url}\n\nThe link works for one hour.`),

  passwordReset: (to: string, url: string) =>
    send(to, "Reset your password", `Open this link to choose a new password for Health Hub:\n\n${url}\n\nThe link works for one hour. Your other sessions will be signed out.`),

  changeEmailConfirmation: (to: string, newEmail: string, url: string) =>
    send(
      to,
      "Confirm your new email address",
      `Someone asked to change the email address on your Health Hub account to ${newEmail}.\n\nIf this was you, open this link to approve it:\n\n${url}\n\nIf it was not you, do not open the link. Sign in and change your password.`,
    ),

  emailChanged: (to: string, newEmail: string) =>
    send(to, "Your email address was changed", `The email address on your Health Hub account is now ${newEmail}. Emails will go there from now on.`),

  passwordChanged: (to: string) =>
    send(to, "Your password was changed", "The password on your Health Hub account was changed. Your other sessions have been signed out."),

  twoFactorChanged: (to: string, on: boolean) =>
    send(
      to,
      on ? "Authenticator app turned on" : "Authenticator app turned off",
      on
        ? "An authenticator app is now required when you sign in to Health Hub with your password."
        : "Your Health Hub account no longer asks for an authenticator app code when you sign in.",
    ),

  passkeyChanged: (to: string, added: boolean) =>
    send(
      to,
      added ? "A passkey was added" : "A passkey was removed",
      added ? "A new passkey can now be used to sign in to your Health Hub account." : "A passkey was removed from your Health Hub account.",
    ),

  erasureComplete: (to: string) =>
    send(
      to,
      "Your account has been deleted",
      "Your Health Hub account has been deleted, with everything it held. Nothing was kept, and it cannot be undone.\n\nThis is the last email we will send to this address.",
    ),
};
