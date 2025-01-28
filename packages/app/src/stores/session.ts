import { queryOptions, useMutation, useQuery } from '@tanstack/react-query'
import { queryClient } from '~/utils/tanstack'
import { redirect, useNavigate } from '@tanstack/react-router'
import { getSession, type SessionData, signOut } from '~/utils/auth-client'

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: async (): Promise<SessionData> => {
    const session = await getSession()
    if (session.error) throw session.error
    return session.data
  },
  retry: false,
})

/** Get user in cache */
export const getUserQueryData = () =>
  queryClient.getQueryData(userQueryOptions.queryKey)
export const setUserQueryData = (data: SessionData) =>
  queryClient.setQueryData(userQueryOptions.queryKey, data)
export const ensureUserQueryData = () =>
  queryClient.ensureQueryData(userQueryOptions)

export const useUser = () => useQuery(userQueryOptions)
export const isLoggedIn = () => !!getUserQueryData()?.user

export const useLogout = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async () => {
      const t = await signOut()
      if (t.error) throw t.error
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
