import { Loader2 } from 'lucide-react'

export const ButtonLoader = () => {
  return (
    <>
      <Loader2 className='animate-spin' />
      <span className='sr-only'>loading...</span>
    </>
  )
}
