import { createAuthClient } from 'better-auth/react'
import { config } from './config'

export const { signIn, useSession, signOut, getSession } = createAuthClient({
  baseURL: config.authUrl, // the base url of your auth server
})

export type SessionData = Awaited<ReturnType<typeof getSession<object>>>['data']
