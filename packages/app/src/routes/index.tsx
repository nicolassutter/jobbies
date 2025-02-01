import { createFileRoute } from '@tanstack/react-router'
import { requireAuth, useAuth } from '~/stores/session'
import { Application } from '~/components/Application'
import {
  ApplicationDeletionModal,
  ApplicationEditionModal,
} from '~/components/Application'
import { trpc } from '~/utils/trpc.client'
import { ButtonLoader } from '~/components/Loaders'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  beforeLoad() {
    requireAuth()
  },
})

function HomeComponent() {
  const { user } = useAuth()
  const applicationsQuery = trpc.applications.read.useQuery()

  return (
    <main className='p-4 w-full'>
      <div className='grid justify-start gap-4 pt-10'>
        <h1 className='h1'>Welcome {user?.name}</h1>

        {applicationsQuery.isPending ? (
          <ButtonLoader />
        ) : (
          <>
            <ApplicationDeletionModal />

            <div className='flex'>
              <ApplicationEditionModal trigger={true} />
            </div>
          </>
        )}
      </div>

      <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-6'>
        {applicationsQuery.data?.map((application) => (
          <Application
            key={application.id}
            application={application}
          />
        ))}
      </div>
    </main>
  )
}
