import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@internal/server/trpc'

export const trpc = createTRPCReact<AppRouter>()
