import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@internal/server/trpc'
import { httpBatchLink } from '@trpc/client'
import { config } from './config'
import { getCookie } from '~/stores/session'

const trpc = createTRPCReact<AppRouter>()

const createTRPCClient = () =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url: config.trpcUrl,
        // wrap fetch to include credentials (cookies)
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
        // You can pass any HTTP headers you wish here
        async headers() {
          return {
            'X-PB-AUTH': getCookie(),
          }
        },
      }),
    ],
  })

export { createTRPCClient, trpc }
