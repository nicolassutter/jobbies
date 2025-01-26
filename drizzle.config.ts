import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import { env } from "./env";

const driver = env.DEV ? "pglite" : undefined;

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  ...(driver ? { driver } : {}),
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
