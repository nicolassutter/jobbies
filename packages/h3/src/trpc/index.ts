import { initTRPC, TRPCError } from '@trpc/server'
import { type Context } from './context'

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = publicProcedure.use(async (opts) => {
  const { ctx } = opts

  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return opts.next({
    ctx: {
      // user is now non null, so TS nows it's defined
      user: ctx.user,
    },
  })
})
