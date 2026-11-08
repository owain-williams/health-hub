/**
 * Identity: Void-managed Better Auth (ADR 0003, docs/specs/identity.md).
 *
 * Account = Better Auth `user`. Better Auth's own `account` table holds
 * credential links and is not an Account.
 */
import { passkey } from "@better-auth/passkey";
import { APIError, createAuthMiddleware, getSessionFromCtx } from "better-auth/api";
import { haveIBeenPwned, twoFactor } from "better-auth/plugins";
import { defineAuth } from "void/auth";
import { identityEmails } from "./src/application/identity/emails";
import { createPersonForAccount, isAllowlisted } from "./src/application/identity/persons";
import { recordSignInEvent } from "./src/application/identity/signInHistory";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  RECENT_SIGN_IN_MS,
  SESSION_IDLE_LIMIT_MS,
  isRecentSignIn,
  normaliseName,
  type SignInEventKind,
} from "./src/domains/identity/rules";

/** Better Auth endpoints that need a Recent Sign-in. */
const NEEDS_RECENT_SIGN_IN = new Set(["/change-password", "/change-email", "/two-factor/disable", "/passkey/delete-passkey"]);

/** Endpoints that complete a sign-in when they create a session. */
const SIGN_IN_PATHS = new Set(["/sign-in/email", "/two-factor/verify-totp", "/two-factor/verify-backup-code", "/passkey/verify-authentication"]);

/** Same reply for every sign-up, so it never reveals whether an address is on the Allowlist or already has an Account. */
const NEUTRAL_SIGN_UP_REPLY = { token: null, user: null };

/** Changes noticed in a `user.update.before` hook, read back in `user.update.after` for the same request. */
const pendingUserChanges = new WeakMap<object, { email?: boolean; twoFactor?: boolean }>();

const passwordProblem = (password: unknown): string | null => {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH)
    return `Use at least ${PASSWORD_MIN_LENGTH} characters. A few ordinary words strung together works well.`;
  if (password.length > PASSWORD_MAX_LENGTH) return `Use no more than ${PASSWORD_MAX_LENGTH} characters.`;
  return null;
};

const userAgentOf = (headers: Headers | undefined) => headers?.get("user-agent") ?? null;

async function record(accountId: string, kind: SignInEventKind, headers: Headers | undefined) {
  try {
    await recordSignInEvent(accountId, kind, userAgentOf(headers));
  } catch (error) {
    console.error(`identity: could not record ${kind} in Sign-in History`, error);
  }
}

async function notify(task: () => Promise<void>) {
  try {
    await task();
  } catch (error) {
    console.error("identity: security email failed", error);
  }
}

export default defineAuth(({ defaults, request }) => {
  const origin = new URL(request.url).origin;
  const rpID = new URL(request.url).hostname;

  return {
    ...defaults,
    appName: "Health Hub",

    emailAndPassword: {
      ...defaults.emailAndPassword,
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
      minPasswordLength: PASSWORD_MIN_LENGTH,
      maxPasswordLength: PASSWORD_MAX_LENGTH,
      resetPasswordTokenExpiresIn: 60 * 60,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => identityEmails.passwordReset(user.email, url),
      onPasswordReset: async ({ user }, req) => {
        await record(user.id, "password_reset", req?.headers);
        await notify(() => identityEmails.passwordChanged(user.email));
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: true,
      autoSignInAfterVerification: false,
      expiresIn: 60 * 60,
      sendVerificationEmail: async ({ user, url }) => identityEmails.verification(user.email, url),
    },

    user: {
      changeEmail: {
        enabled: true,
        sendChangeEmailConfirmation: async ({ user, newEmail, url }) => identityEmails.changeEmailConfirmation(user.email, newEmail, url),
      },
      // Erasure is our own use case (src/application/identity/erase.ts), so Better Auth's delete endpoint stays off.
      deleteUser: { enabled: false },
    },

    session: {
      expiresIn: SESSION_IDLE_LIMIT_MS / 1000,
      updateAge: 15 * 60,
      freshAge: RECENT_SIGN_IN_MS / 1000,
    },

    rateLimit: {
      ...defaults.rateLimit,
      storage: "database",
    },

    plugins: [
      twoFactor({ issuer: "Health Hub" }),
      passkey({ rpID, rpName: "Health Hub", origin }),
      haveIBeenPwned({
        customPasswordCompromisedMessage:
          "This password has appeared in a known data breach elsewhere, so it is not safe to use. Please choose a different one.",
      }),
    ],

    databaseHooks: {
      user: {
        create: {
          before: async (user) => {
            // Defence in depth: the sign-up hook below already replies neutrally.
            if (!(await isAllowlisted(user.email))) return false;
            return { data: { ...user, name: normaliseName(user.name) } };
          },
          after: async (user, ctx) => {
            // Better Auth runs this after the user row is written, outside any
            // transaction. If the Person cannot be created, remove the Account
            // so that no Account ever exists without its Person.
            try {
              await createPersonForAccount(user.id, user.name);
            } catch (error) {
              console.error("identity: Person creation failed; removing the new Account", error);
              await ctx?.context.internalAdapter.deleteUser(user.id);
              throw new APIError("INTERNAL_SERVER_ERROR", { message: "Your account could not be created. Please try again." });
            }
          },
        },
        update: {
          before: async (data, ctx) => {
            if (!ctx) return;
            const change: { email?: boolean; twoFactor?: boolean } = {};
            if (typeof data.email === "string" && ctx.path === "/verify-email") change.email = true;
            if ("twoFactorEnabled" in data && typeof data.twoFactorEnabled === "boolean") change.twoFactor = data.twoFactorEnabled;
            if (Object.keys(change).length > 0) pendingUserChanges.set(ctx, change);
          },
          after: async (user, ctx) => {
            const change = ctx ? pendingUserChanges.get(ctx) : undefined;
            if (!change || !ctx) return;
            pendingUserChanges.delete(ctx);
            if (change.email) {
              await record(user.id, "email_changed", ctx.headers);
              await notify(() => identityEmails.emailChanged(user.email, user.email));
            }
            if (change.twoFactor !== undefined) {
              await record(user.id, change.twoFactor ? "two_factor_on" : "two_factor_off", ctx.headers);
              await notify(() => identityEmails.twoFactorChanged(user.email, change.twoFactor === true));
            }
          },
        },
      },
    },

    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-up/email") {
          const problem = passwordProblem(ctx.body?.password);
          if (problem) throw new APIError("BAD_REQUEST", { message: problem, code: "PASSWORD_TOO_SHORT" });
          if (typeof ctx.body?.name !== "string" || ctx.body.name.trim() === "")
            throw new APIError("BAD_REQUEST", { message: "Tell us what to call you.", code: "NAME_REQUIRED" });
          if (typeof ctx.body?.email !== "string" || !(await isAllowlisted(ctx.body.email))) return ctx.json(NEUTRAL_SIGN_UP_REPLY);
          return;
        }

        if (NEEDS_RECENT_SIGN_IN.has(ctx.path)) {
          const current = await getSessionFromCtx(ctx);
          if (!current) throw new APIError("UNAUTHORIZED", { message: "Please sign in." });
          if (!isRecentSignIn(new Date(current.session.createdAt), new Date()))
            throw new APIError("FORBIDDEN", {
              message: "For your safety, please sign in again before making this change.",
              code: "RECENT_SIGN_IN_REQUIRED",
            });
        }

        if (ctx.path === "/change-password") {
          // Changing the password always signs out every other session.
          return { context: { body: { ...ctx.body, revokeOtherSessions: true } } };
        }
      }),

      after: createAuthMiddleware(async (ctx) => {
        const returned = ctx.context.returned;
        const failed = returned instanceof APIError || returned instanceof Error;

        // Every accepted sign-up gets the same reply, whether or not an Account was created.
        if (ctx.path === "/sign-up/email" && !failed) return ctx.json(NEUTRAL_SIGN_UP_REPLY);

        // Successful sign-in. User hooks run before plugin hooks, so on a
        // password sign-in that still needs a TOTP code the session exists
        // here but is about to be withdrawn: skip it and record the sign-in
        // when the code is verified.
        const newSession = ctx.context.newSession;
        if (!failed && newSession && SIGN_IN_PATHS.has(ctx.path)) {
          const awaitingSecondFactor = ctx.path === "/sign-in/email" && newSession.user.twoFactorEnabled === true;
          const completingSignIn = !ctx.path.startsWith("/two-factor/") || (ctx.headers?.get("cookie") ?? "").includes("two_factor");
          if (!awaitingSecondFactor && completingSignIn) await record(newSession.user.id, "signed_in", ctx.headers);
        }

        if (ctx.path === "/sign-in/email" && returned instanceof APIError && returned.statusCode === 401) {
          const email = typeof ctx.body?.email === "string" ? ctx.body.email : null;
          const found = email ? await ctx.context.internalAdapter.findUserByEmail(email) : null;
          if (found) await record(found.user.id, "sign_in_failed", ctx.headers);
        }

        const sessionUser = ctx.context.session?.user;
        if (failed || !sessionUser) return;

        if (ctx.path === "/change-password") {
          await record(sessionUser.id, "password_changed", ctx.headers);
          await notify(() => identityEmails.passwordChanged(sessionUser.email));
        }
        if (ctx.path === "/passkey/verify-registration") {
          await record(sessionUser.id, "passkey_added", ctx.headers);
          await notify(() => identityEmails.passkeyChanged(sessionUser.email, true));
        }
        if (ctx.path === "/passkey/delete-passkey") {
          await record(sessionUser.id, "passkey_removed", ctx.headers);
          await notify(() => identityEmails.passkeyChanged(sessionUser.email, false));
        }
      }),
    },
  };
});
