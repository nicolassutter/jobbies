// Import h3 as npm dependency
import {
  createApp,
  createRouter,
  defineEventHandler,
  type H3CorsOptions,
  handleCors,
  toWebRequest,
} from 'h3'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter } from './trpc/routers/app.router'
import { createContext } from './trpc/context'
import { env } from './utils/env'

// Create an app instance
export const app = createApp()

const cors = defineEventHandler(async (event) => {
  const corsOptions: H3CorsOptions = {
    origin: env.DEV ? '*' : ['https://jobbies-app.netlify.app'],
    credentials: true,
    preflight: {
      statusCode: 204,
    },
    methods: '*',
  }

  handleCors(event, corsOptions)
})

app.use(cors)

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
