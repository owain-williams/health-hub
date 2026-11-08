import { defineHandler, defineHead, type InferProps } from "void";
import { ValidationError } from "void/handler";
import { getSession } from "void/auth";
import { db, sql } from "void/db";
import { rowsOf } from "../src/application/db";
import { z } from "zod";
import { accountEmail, eraseAccount, ErasureRefused } from "../src/application/identity/erase";
import { requirePerson } from "../src/application/identity/requirePerson";
import { listSignInHistory } from "../src/application/identity/signInHistory";
import { describeDevice, isRecentSignIn, SIGN_IN_EVENT_LABELS, type SignInEventKind } from "../src/domains/identity/rules";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler(async (c) => {
  const { person, signedIn } = requirePerson(c);
  const now = new Date();

  const sessions = rowsOf<{ id: string; createdAt: Date; updatedAt: Date; userAgent: string | null }>(
    await db.execute(
    sql`select "id", "createdAt", "updatedAt", "userAgent" from "session"
        where "userId" = ${signedIn.accountId} and "expiresAt" > now() order by "updatedAt" desc`,
    ),
  );
  const passkeys = rowsOf<{ id: string; name: string | null; createdAt: Date | null }>(
    await db.execute(sql`select "id", "name", "createdAt" from "passkey" where "userId" = ${signedIn.accountId} order by "createdAt"`),
  );
  const history = await listSignInHistory(signedIn.accountId, now);

  return {
    account: {
      name: signedIn.accountName,
      email: signedIn.accountEmail,
      twoFactorEnabled: getSession()?.user.twoFactorEnabled === true,
    },
    personName: person.name,
    recentSignIn: isRecentSignIn(new Date(signedIn.signedInAt), now),
    sessions: sessions.map((s) => ({
      id: s.id,
      current: s.id === signedIn.sessionId,
      device: describeDevice(s.userAgent),
      signedInAt: new Date(s.createdAt).toISOString(),
      lastUsedAt: new Date(s.updatedAt).toISOString(),
    })),
    passkeys: passkeys.map((p) => ({
      id: p.id,
      name: p.name || "Passkey",
      addedAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
    })),
    history: history.map((h) => ({
      id: h.id,
      what: SIGN_IN_EVENT_LABELS[h.kind as SignInEventKind] ?? h.kind,
      failed: h.kind === "sign_in_failed",
      device: h.device,
      at: h.occurredAt.toISOString(),
    })),
  };
});

export const actions = {
  revokeSession: defineHandler.withValidator({ body: z.object({ sessionId: z.string().min(1) }) })(async (c, { body }) => {
    const { signedIn } = requirePerson(c);
    if (body.sessionId === signedIn.sessionId) throw new ValidationError({ sessionId: "Use “Sign out” to end this session." });
    await db.execute(sql`delete from "session" where "id" = ${body.sessionId} and "userId" = ${signedIn.accountId}`);
  }),

  revokeOtherSessions: defineHandler(async (c) => {
    const { signedIn } = requirePerson(c);
    await db.execute(sql`delete from "session" where "userId" = ${signedIn.accountId} and "id" <> ${signedIn.sessionId}`);
  }),

  erase: defineHandler.withValidator({ body: z.object({ confirmEmail: z.string() }) })(async (c, { body }) => {
    const { signedIn } = requirePerson(c);
    const email = (await accountEmail(signedIn.accountId)) ?? signedIn.accountEmail;
    try {
      await eraseAccount({ accountId: signedIn.accountId, accountEmail: email, signedInAt: new Date(signedIn.signedInAt), typedEmail: body.confirmEmail });
    } catch (error) {
      if (error instanceof ErasureRefused) throw new ValidationError({ confirmEmail: error.message });
      throw error;
    }
    return c.redirect("/erased");
  }),
};

export const head = defineHead(() => ({
  title: "Your account",
  meta: [{ name: "robots", content: "noindex" }],
}));
