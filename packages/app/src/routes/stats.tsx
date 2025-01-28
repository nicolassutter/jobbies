import { createFileRoute } from '@tanstack/react-router'
import { ApplicationsByStatusChart } from '~/components/Charts'
import { requireAuth } from '~/stores/session'

export const Route = createFileRoute('/stats')({
  component: StatsComponent,
  beforeLoad() {
    requireAuth()
  },
})

function StatsComponent() {
  return (
    <main
      role='main'
      className='p-4 pt-10'
    >
      <h1 className='h1'>Your stats</h1>

      <div className='w-full grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-6'>
        <div>
          <ApplicationsByStatusChart />
        </div>
      </div>
    </main>
  )
}
