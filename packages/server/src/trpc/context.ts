import Pocketbase from 'pocketbase'
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { env } from '../utils/env'

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  // we need to create a new Pocketbase for each request
  const pb = new Pocketbase(env.AUTH_URL)
  const cookie = req.headers.get('X-PB-AUTH')

  pb.authStore.loadFromCookie(cookie || '')

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth record (if any)
    if (pb.authStore.isValid) await pb.collection('users').authRefresh()
  } catch (error) {
    console.log('Failed to refresh auth, clearing the auth store...', error)
    // clear the auth store on failed refresh
    pb.authStore.clear()
  }

  const userId = pb.authStore.record?.id
  const user = userId ? { id: userId } : null

  return { req, resHeaders, user }
}

export type Context = Awaited<ReturnType<typeof createContext>>
