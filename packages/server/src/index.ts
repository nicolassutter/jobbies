// Import h3 as npm dependency
import { createApp, createRouter, defineEventHandler, toWebRequest } from 'h3'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc/routers/app.router'
import { createContext } from './trpc/context'

// Create an app instance
export const app = createApp()

// Create a new router and register it in app
const router = createRouter()

app.use(router.handler)

// Add a new route that matches GET requests to / path
router.use(
  '/api/trpc/**',
  defineEventHandler((event) => {
    const request = toWebRequest(event)

    return fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext,
    })
  }),
)
