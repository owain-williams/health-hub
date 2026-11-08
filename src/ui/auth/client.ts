/** Browser-side Better Auth client with the plugins enabled in auth.ts. */
import { passkeyClient } from "@better-auth/passkey/client";
import { twoFactorClient } from "better-auth/client/plugins";
import { createAuthClient } from "void/client";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  plugins: [twoFactorClient(), passkeyClient()],
});

/** Better Auth error codes mapped to plain messages. Anything unmapped falls back to the server's own message. */
const MESSAGES: Record<string, string> = {
  INVALID_EMAIL: "Enter your email address, like name@example.com.",
  INVALID_EMAIL_OR_PASSWORD: "That email address and password do not match. Check both and try again.",
  EMAIL_NOT_VERIFIED: "Your email address is not confirmed yet. We have sent you a new link; open it, then sign in.",
  INVALID_CODE: "That code did not work. Codes change every 30 seconds, so try the newest one.",
  INVALID_BACKUP_CODE: "That backup code did not work. Each backup code can be used once.",
  INVALID_PASSWORD: "That password is not right.",
  PASSWORD_COMPROMISED: "This password has appeared in a known data breach elsewhere, so it is not safe to use. Please choose a different one.",
  RECENT_SIGN_IN_REQUIRED: "For your safety, please sign in again before making this change.",
  INVALID_TOKEN: "This link has expired or has already been used. Please ask for a new one.",
  TOO_MANY_REQUESTS: "Too many attempts in a short time. Please wait a minute and try again.",
};

export function messageFor(error: { code?: string; message?: string; status?: number } | null | undefined): string {
  if (!error) return "Something went wrong. Please try again.";
  if (error.status === 429) return MESSAGES.TOO_MANY_REQUESTS;
  if (error.code && MESSAGES[error.code]) return MESSAGES[error.code];
  return error.message || "Something went wrong. Please try again.";
}

export function isRecentSignInRequired(error: { code?: string } | null | undefined): boolean {
  return error?.code === "RECENT_SIGN_IN_REQUIRED";
}
