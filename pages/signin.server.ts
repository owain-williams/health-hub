import { defineHandler, defineHead, type InferProps } from "void";
import { safeNextPath } from "../src/domains/identity/rules";

export type Props = InferProps<typeof loader>;

export const loader = defineHandler((c) => ({
  next: safeNextPath(c.req.query("next")),
  reauth: c.req.query("reauth") === "1",
  reset: c.req.query("reset") === "1",
}));

export const head = defineHead(() => ({
  title: "Sign in",
  meta: [{ name: "robots", content: "noindex" }],
}));
