import { router } from '..'
import { applicationsRouter } from './applications.router'

export const appRouter = router({
  applications: applicationsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
