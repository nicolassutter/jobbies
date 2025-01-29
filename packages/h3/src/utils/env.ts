import { z } from 'zod'

const envVariables = z.object({
  DATABASE_URL: z
    .string()
    .optional()
    .default('postgresql://local:local@localhost:5432/jobbies'),
  DEV: z.boolean(),
  PROD: z.boolean(),
  AUTH_URL: z.string().optional().default('http://localhost:8080'),
})

export const env = envVariables.parse({
  ...process.env,
  DEV: process.env.NODE_ENV === 'development',
  PROD: process.env.NODE_ENV === 'production',
})
