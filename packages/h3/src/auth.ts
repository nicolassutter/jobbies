import { betterAuth } from 'better-auth'
import { APIError } from 'better-auth/api'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    // this with `sendVerificationEmail` throwing below will essentially disable email signup
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async () => {
      throw new APIError('FORBIDDEN', {
        message: 'Email verification is disabled',
      })
    },
  },
})
