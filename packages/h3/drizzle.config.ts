import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { env } from './src/utils/env'

const driver = !env.PROD ? 'pglite' : undefined

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  ...(driver ? { driver } : {}),
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
