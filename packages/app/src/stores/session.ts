import PocketBase, { type RecordService, type AuthRecord } from 'pocketbase'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '~/utils/tanstack'
import { redirect, useNavigate } from '@tanstack/react-router'
import { config } from '~/utils/config'
import type { OmitIndexSignature } from 'type-fest'

type User = {
  email: string
  name?: string
  avatar?: string
}

interface TypedPocketBase extends PocketBase {
  collection(idOrName: string): RecordService // default fallback for any other collection
  collection(idOrName: 'users'): RecordService<User>
}
const pb = new PocketBase(config.authUrl) as TypedPocketBase

/**
 * Remove every `any` from the default type
 */
type SafeAuthRecord = (OmitIndexSignature<AuthRecord> & User) | null | undefined

export const signIn = (email: string, password: string) =>
  pb.collection('users').authWithPassword(email, password)

export const isSessionValid = () => pb.authStore.isValid
export const getSession = () => pb.authStore.record as SafeAuthRecord
export const getCookie = () => pb.authStore.exportToCookie()
export const refreshSession = async () => {
  await pb.collection('users').authRefresh()
  return getSession()
}

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async (): Promise<SafeAuthRecord> => {
    if (!isSessionValid()) return null
    const session = refreshSession()
    return session
  },
  retry: false,
})

/** Get user in cache */
export const getUserQueryData = () =>
  queryClient.getQueryData(userQueryOptions.queryKey)

export const setUserQueryData = (data: SafeAuthRecord) =>
  queryClient.setQueryData(userQueryOptions.queryKey, data)

export const ensureUserQueryData = () =>
  queryClient.ensureQueryData(userQueryOptions)

export const useUser = () => useQuery(userQueryOptions)
export const isLoggedIn = () => isSessionValid() && !!getUserQueryData()

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      pb.authStore.clear()
    },
    onSuccess() {
      setUserQueryData(null)
      navigate({ to: '/login' })
    },
  })
}

export const requireAuth = () => {
  if (!isLoggedIn()) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
}
export const useLogin = () => {
  const navigate = useNavigate()
  const userQuery = useUser()

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const authData = getUserQueryData()

      if (authData) {
        // already logged in
        return authData
      }

      const result = await signIn(data.email, data.password)
      return result.record
    },
    async onSuccess() {
      await userQuery.refetch()
      navigate({ to: '/' })
    },
  })
}
