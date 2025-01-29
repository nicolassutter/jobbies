import { createFileRoute, redirect } from '@tanstack/react-router'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getUserQueryData, useLogin } from '~/stores/session'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ButtonLoader } from '~/components/Loaders'

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  beforeLoad() {
    const user = getUserQueryData()

    // alread logged in, cannot access login page
    if (user) {
      throw redirect({
        to: '/',
      })
    }
  },
})

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

function LoginComponent() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useLogin()

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          loginMutation.mutateAsync(values),
        )}
        className='p-4 min-h-[100dvh] flex flex-col items-center justify-center w-full'
      >
        <Card className='w-full max-w-[350px]'>
          <CardHeader>
            <CardTitle>Sign-in to your account</CardTitle>
          </CardHeader>

          <CardContent>
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button
              type='submit'
              disabled={loginMutation.isPending}
            >
              Sign-in
              {loginMutation.isPending && <ButtonLoader />}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
