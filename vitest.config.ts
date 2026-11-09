// Tests run without the Void plugin: it boots the Worker runtime, which unit
// and contract tests do not need. Adapters that need Postgres or R2 get them
// from the test files themselves.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: { "@schema": fileURLToPath(new URL("./db/schema.ts", import.meta.url)) },
  },
  test: {
    include: ["src/**/*.test.ts", "db/**/*.test.ts", "routes/**/*.test.ts"],
  },
});
