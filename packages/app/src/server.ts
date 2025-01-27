import { drizzle as devDrizzle } from "drizzle-orm/pglite";
import { drizzle as productionDrizzle } from "drizzle-orm/node-postgres";
import { env } from "../env";

export const db = env.DEV
  ? devDrizzle("./pglite")
  : productionDrizzle(env.DATABASE_URL);
