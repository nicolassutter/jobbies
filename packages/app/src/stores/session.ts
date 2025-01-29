import PocketBase, { type AuthRecord } from 'pocketbase'
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '~/utils/tanstack'
import { redirect, useNavigate } from '@tanstack/react-router'
import { config } from '~/utils/config'

const pb = new PocketBase(config.authUrl)

export const signIn = (email: string, password: string) =>
  pb.collection('users').authWithPassword(email, password)

export const isSessionValid = () => pb.authStore.isValid
export const getSession = () => pb.authStore.record

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async (): Promise<AuthRecord> => {
    if (!isSessionValid()) throw new Error('Session is not valid')
    const session = getSession()
    return session
  },
  retry: false,
})

/** Get user in cache */
export const getUserQueryData = () =>
  queryClient.getQueryData(userQueryOptions.queryKey)

export const setUserQueryData = (data: AuthRecord) =>
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
    mutationFn: async (data: {
      email: string
      password: string
    }): Promise<AuthRecord> => {
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
