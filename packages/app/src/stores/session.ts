import PocketBase, { type RecordService, type AuthRecord } from 'pocketbase'
import { useMutation } from '@tanstack/react-query'
import {
  getRouteApi,
  redirect,
  RouteApi,
  useNavigate,
  useSearch,
  type RouteById,
} from '@tanstack/react-router'
import { config } from '~/utils/config'
import type { OmitIndexSignature } from 'type-fest'
import { create } from 'zustand'

type User = {
  email: string
  name?: string
  avatar?: string
}

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'users'): RecordService<User>
}

const useAuthStore = create<{
  user: SafeAuthRecord
  authReady: boolean
}>(() => ({
  user: null,
  /**
   * This is to make sure that auth is ready so we can protect routes
   */
  authReady: false,
}))

const isLoggedIn = (pb: PocketBase) =>
  Boolean(pb.authStore.isValid && pb.authStore.record)

const createPb = () => {
  const pb = new PocketBase(config.authUrl) as TypedPocketBase

  /**
   * When pb store changes, update ours
   */
  pb.authStore.onChange(() => {
    const user = isLoggedIn(pb)
      ? (pb.authStore.record as SafeAuthRecord)
      : undefined

    useAuthStore.setState({ user, authReady: true })
  }, true)

  return pb
}

const pb = createPb()

const getCookie = () => pb.authStore.exportToCookie()

/**
 * Remove every `any` from the default type
 */
type SafeAuthRecord = (OmitIndexSignature<AuthRecord> & User) | null | undefined

export const useAuth = () => {
  const navigate = useNavigate()
  const searchParams = useSearch({
    strict: false,
  })
  const user = useAuthStore((state) => state.user)

  // we don't have to make it a mutation but just in case of future refactoring
  const logout = useMutation({
    mutationFn: async () => {
      pb.authStore.clear()
    },
    onSuccess() {
      navigate({ to: '/login' })
    },
  })

  const login = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const user = useAuthStore.getState().user

      // already logged in
      if (user) return user

      const result = await pb
        .collection('users')
        .authWithPassword(data.email, data.password)

      return result.record
    },
    async onSuccess() {
      navigate({ to: searchParams.redirect ?? '/' })
    },
  })

  return { logout, login, user }
}

/**
 * Makes sure that auth is ready by checking that the store has changed once
 */
export const ensureAuthReady = async (): Promise<SafeAuthRecord> => {
  const state = () => useAuthStore.getState()

  // auth is ready
  if (state().authReady === true) return state().user

  // auth is not ready but there is a record in store, try to refresh it
  if (pb.authStore.record) {
    await pb.collection('users').authRefresh()
  }

  // auth is ready
  useAuthStore.setState({ authReady: true })
  return state().user
}

export const LoginPageApi = getRouteApi('/login')

export const requireAuth = () => {
  if (!isLoggedIn(pb)) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.pathname,
      } satisfies ReturnType<(typeof LoginPageApi)['useSearch']>,
    })
  }
}

const _isLoggedIn = () => isLoggedIn(pb)
export { getCookie, _isLoggedIn as isLoggedIn }
