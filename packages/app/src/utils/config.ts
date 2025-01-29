export const config = {
  authUrl: import.meta.env.VITE_AUTH_URL ?? 'http://localhost:8080',
  trpcUrl: import.meta.env.VITE_TRPC_URL ?? 'http://localhost:8888/api/trpc',
}
