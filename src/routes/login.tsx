import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "~/utils/appwrite";
import { Loader2 } from "lucide-react";
import {
  getSessionQueryData,
  getUserQueryData,
  userQueryOptions,
} from "~/stores/session";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
  beforeLoad() {
    const user = getUserQueryData();

    // alread logged in, cannot access login page
    if (user) {
      throw redirect({
        to: "/",
      });
    }
  },
});

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginComponent() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (data: z.infer<typeof schema>) => {
      const session = getSessionQueryData();
      if (session) {
        // already logged in
        return session;
      }
      return login(data.email, data.password);
    },
    async onSuccess(session) {
      // update the query without refetching
      queryClient.setQueryData(["session"], () => session);

      // need to fetch the user data
      await queryClient.fetchQuery(userQueryOptions);

      navigate({ to: "/" });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          loginMutation.mutateAsync(values),
        )}
      >
        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="email"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loginMutation.isPending}>
          Sign-in
          {loginMutation.isPending && (
            <>
              <Loader2 className="animate-spin" />
              <span className="sr-only">loading...</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
