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
import { isLoggedIn, useAuth } from '~/stores/session'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { ButtonLoader } from '~/components/Loaders'

const searchSchema = z.object({
  // optional query param to redirect to after login
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  validateSearch: searchSchema,
  beforeLoad() {
    // alread logged in, cannot access login page
    if (isLoggedIn()) {
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

  const { login: loginMutation } = useAuth()

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
            <p className='text-xs text-muted-foreground'>
              <span className='font-bold'>Demo credentials</span>
              <br />
              email: demo@user.com
              <br />
              password: demo1234
            </p>
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
