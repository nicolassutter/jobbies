import { type FunctionComponent } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { create } from 'zustand'
import { ButtonLoader } from '../Loaders'
import { combine } from 'zustand/middleware'
import { trpc } from '~/utils/trpc.client'

export const useApplicationDeletionModal = create(
  combine(
    {
      applicationId: null as string | null,
      isModalOpen: false,
    },
    (set) => ({
      open: (id: string) => set({ applicationId: id, isModalOpen: true }),
      close: () => set({ applicationId: null, isModalOpen: false }),
    }),
  ),
)

export const ApplicationDeletionModal: FunctionComponent = () => {
  const utils = trpc.useUtils()

  const { applicationId, isModalOpen, close } = useApplicationDeletionModal()

  const deleteMutation = trpc.applications.delete.useMutation({
    async onSuccess(_, deletedId) {
      // remove the deleted application from the cache
      utils.applications.read.setData(undefined, (cache) => {
        if (!cache) return
        const newCache = cache?.filter((app) => app.id !== deletedId)
        return newCache
      })

      close()
    },
  })

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(status) => {
        if (status) {
          if (applicationId) open(applicationId)
        } else {
          close()
        }
      }}
    >
      <DialogContent className='w-full max-w-lg'>
        <DialogHeader>
          <DialogTitle>Delete application</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this application?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:gap-0'>
          <DialogClose asChild>
            <Button variant='secondary'>Cancel</Button>
          </DialogClose>
          <Button
            type='submit'
            variant={'destructive'}
            onClick={() => {
              if (applicationId) {
                deleteMutation.mutate(applicationId)
              }
            }}
          >
            Delete
            {deleteMutation.isPending && <ButtonLoader />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
