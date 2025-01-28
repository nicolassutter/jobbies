import { z } from 'zod'

const envVariables = z.object({
  DATABASE_URL: z.string().optional().default('./pglite'),
  DEV: z.boolean(),
})

export const env = envVariables.parse({
  ...process.env,
  DEV: process.env.NODE_ENV !== 'production',
})
