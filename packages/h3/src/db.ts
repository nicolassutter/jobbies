import { drizzle as devDrizzle } from 'drizzle-orm/pglite'
import { drizzle as productionDrizzle } from 'drizzle-orm/node-postgres'
import { env } from './utils/env'
import * as schema from '../db/schema'

export const db = env.DEV
  ? devDrizzle(env.DATABASE_URL, {
      schema,
    })
  : productionDrizzle(env.DATABASE_URL, {
      schema,
    })
