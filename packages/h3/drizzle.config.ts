import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { env } from './src/utils/env'

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
