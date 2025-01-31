import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'
import { type z } from 'zod'
import { type ApplicationSchema } from '@internal/shared'

const t = initTRPC.context<Context>().create()

const globalStorage = new Map()

function useStorage<R extends Record<string, unknown>>(
  key: string,
  initialValue: R,
  timeout?: number,
) {
  if (!globalStorage.has(key)) globalStorage.set(key, initialValue)

  setTimeout(
    () => {
      globalStorage.delete(key)
    },
    timeout ?? /*10 minutes*/ 10 * 60 * 1000,
  )

  return globalStorage.get(key) as R
}

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts

  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  const isDemoUser = ctx.user.email === 'demo@user.com'

  const demoUserUniqueStorage = () => {
    const demoUserUniqueId = ctx.req.headers.get('X-PB-DEMO-USER-ID')

    if (!demoUserUniqueId)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Missing X-PB-DEMO-USER-ID header',
      })

    // create in memory storage for that specific demo user
    const storage = useStorage(`demo-user:${demoUserUniqueId}`, {
      applications: [] as z.infer<typeof ApplicationSchema>[],
    })

    return storage
  }

  // discriminate between demo user and regular user
  const newCtx = isDemoUser
    ? {
        user: ctx.user,
        isDemoUser: true,
        demoUserUniqueStorage: demoUserUniqueStorage(),
      }
    : {
        user: ctx.user,
      }

  return opts.next({
    ctx: newCtx,
  })
})
