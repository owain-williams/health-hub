import { defineEnv, string } from "void/env";

export default defineEnv({
  /**
   * Sender for auth and security emails, e.g. `Health Hub <noreply@mail.example.com>`.
   * Must be on a domain the Cloudflare account can send from. Set in production with `void secret put EMAIL_FROM`.
   */
  EMAIL_FROM: string().optional(),
});
