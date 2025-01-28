import { join } from 'node:path'
import { z } from 'zod'

const envVariables = z.object({
  DATABASE_URL: z.string().optional().default(join(process.cwd(), './pglite')),
  DEV: z.boolean(),
  PROD: z.boolean(),
})

export const env = envVariables.parse({
  ...process.env,
  DEV: process.env.NODE_ENV === 'development',
  PROD: process.env.NODE_ENV === 'production',
})
