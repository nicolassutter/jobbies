import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { auth } from '../auth'

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  const sessionData = await auth.api.getSession({
    headers: req.headers,
  })

  const { user, session } = sessionData ?? {}

  return { req, resHeaders, user, session }
}

export type Context = Awaited<ReturnType<typeof createContext>>
