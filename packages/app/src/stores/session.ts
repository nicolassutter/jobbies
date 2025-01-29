import PocketBase, { type RecordService, type AuthRecord } from 'pocketbase'
import { useMutation } from '@tanstack/react-query'
import { redirect, useNavigate } from '@tanstack/react-router'
import { config } from '~/utils/config'
import type { OmitIndexSignature } from 'type-fest'
import { useEffect, useState } from 'react'

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

export const getSession = () => pb.authStore.record as SafeAuthRecord
export const getCookie = () => pb.authStore.exportToCookie()
export const refreshSession = async () => {
  await pb.collection('users').authRefresh()
  return getSession()
}

export const isLoggedIn = () => pb.authStore.isValid && pb.authStore.record

export const getUser = () => (isLoggedIn() ? getSession() : undefined)

export const useUser = () => {
  const [user, setUser] = useState(getUser())

  const unsub = pb.authStore.onChange(() => {
    setUser(getUser())
  })

  useEffect(() => {
    return () => unsub()
  }, [])

  return user
}

/** Closure to create `ensureAuthReady` */
const authReadyFactory = () => {
  let isAuthReady = false

  return async (): Promise<SafeAuthRecord> => {
    if (isAuthReady === true) return getUser()

    return new Promise((resolve) => {
      const unsub = pb.authStore.onChange(() => {
        resolve(getUser())
        isAuthReady = true
        unsub()
      }, true)
    })
  }
}

/**
 * Makes sure that auth is ready by checking that the store has changed once
 */
export const ensureAuthReady = authReadyFactory()

export const useLogout = () => {
  const navigate = useNavigate()

  // we don't have to make it a mutation but just in case of future refactoring
  return useMutation({
    mutationFn: async () => {
      pb.authStore.clear()
    },
    onSuccess() {
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

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const authData = getUser()

      if (authData) {
        // already logged in
        return authData
      }

      const result = await signIn(data.email, data.password)
      return result.record
    },
    async onSuccess() {
      navigate({ to: '/' })
    },
  })
}
