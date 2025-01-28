// Import h3 as npm dependency
import {
  createApp,
  createRouter,
  defineEventHandler,
  toWebHandler,
  toWebRequest,
} from 'h3'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc/routers/app.router'
import { createContext } from './trpc/context'
import { auth } from './auth'
import { type Context } from '@netlify/functions'

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

router.use(
  '/api/auth/**',
  defineEventHandler((event) => {
    const request = toWebRequest(event)
    return auth.handler(request)
  }),
)

// dev server is handled by listhen

// export for Netlify
const handler = toWebHandler(app)

export default async (req: Request, context: Context) => {
  return handler(req, context)
}
