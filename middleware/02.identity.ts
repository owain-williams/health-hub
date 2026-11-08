/**
 * Authorisation at the edge (ADR 0003): resolve the signed-in Account to the
 * Person it Holds, once per request, and require sign-in everywhere except
 * the public pages.
 */
import { defineMiddleware } from "void";
import { getSession } from "void/auth";
import { db, sql } from "void/db";
import { personHeldBy, type Person } from "../src/application/identity/persons";
import { isPastAbsoluteLimit, isPublicPath } from "../src/domains/identity/rules";

export interface SignedIn {
  accountId: string;
  accountName: string;
  accountEmail: string;
  signedInAt: string;
  sessionId: string;
}

declare module "void" {
  interface CloudContextVariables {
    /** The Person this request acts on, or null when signed out. Use cases take `person.id` only. */
    person: Person | null;
    signedIn: SignedIn | null;
    shared: { account: { name: string } | null };
  }
}

export default defineMiddleware(async (c, next) => {
  const path = c.req.path;
  if (path === "/api/auth" || path.startsWith("/api/auth/") || path.startsWith("/__")) return next();

  let state = getSession();

  if (state && isPastAbsoluteLimit(new Date(state.session.createdAt), new Date())) {
    await db.execute(sql`delete from "session" where "id" = ${state.session.id}`);
    state = null;
  }

  let person: Person | null = null;
  if (state) {
    person = await personHeldBy(state.user.id);
    if (!person) {
      // Invariant: an Account never exists without its Person.
      console.error(`identity: Account ${state.user.id} holds no Person`);
      return c.text("Your account is incomplete. Please contact us.", 500);
    }
  }

  c.set("person", person);
  c.set(
    "signedIn",
    state
      ? {
          accountId: state.user.id,
          accountName: state.user.name,
          accountEmail: state.user.email,
          signedInAt: new Date(state.session.createdAt).toISOString(),
          sessionId: state.session.id,
        }
      : null,
  );
  c.set("shared", { account: state ? { name: state.user.name } : null });

  if (!person && !isPublicPath(path)) {
    if (path.startsWith("/api/")) return c.json({ error: "Sign in to continue." }, 401);
    const target = path + new URL(c.req.url).search;
    return c.redirect(`/signin?next=${encodeURIComponent(target)}`);
  }

  if (person && (path === "/signin" || path === "/signup") && c.req.method === "GET" && !c.req.query("reauth")) {
    return c.redirect("/account");
  }

  await next();
});
