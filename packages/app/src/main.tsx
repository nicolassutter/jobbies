import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { queryClient } from './utils/tanstack'
import { QueryClientProvider } from '@tanstack/react-query'
import './app.css'
import { useMemo } from 'react'
import { createTRPCClient, trpc } from './utils/trpc.client'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version of the app available! Refresh?')) {
      updateSW()
    }
  },
  onOfflineReady() {},
})

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {},
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function InnerApp() {
  return <RouterProvider router={router} />
}

function App() {
  // never recreate the client
  const trpcClient = useMemo(() => createTRPCClient(), [])

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </trpc.Provider>
  )
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<App />)
}
