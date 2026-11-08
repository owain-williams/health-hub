import { HTTPException } from "hono/http-exception";
import type { CloudContext } from "void";
import type { SignedIn } from "../../../middleware/02.identity";
import type { Person } from "./persons";

/** The Person and Account for a signed-in request. Middleware guarantees both on protected routes. */
export function requirePerson(c: CloudContext): { person: Person; signedIn: SignedIn } {
  const person = c.get("person");
  const signedIn = c.get("signedIn");
  if (!person || !signedIn) throw new HTTPException(401, { message: "Sign in to continue." });
  return { person, signedIn };
}
