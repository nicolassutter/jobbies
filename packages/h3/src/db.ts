import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from './utils/env'
import * as schema from '../db/schema'
import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // this helps with ECONNRESET errors when the db sleeps
  statement_timeout: 30000, // 30 seconds
  query_timeout: 30000,
  connectionTimeoutMillis: 20000, // 20 seconds
})

export const db = drizzle({
  client: pool,
  schema,
})
