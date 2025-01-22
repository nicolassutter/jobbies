import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  ApplicationSchema,
  createApplication,
  type Application,
} from "~/utils/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const ApplicationCreationModal = () => {
  const form = useForm<Application>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {},
  });
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (application: Application) => {
      return createApplication(application);
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New application</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) =>
              createMutation.mutateAsync(values),
            )}
          >
            <DialogHeader>
              <DialogTitle>New application</DialogTitle>
              <DialogDescription>
                Provide some details about the job you're applying for.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="job_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job title</FormLabel>
                    <FormControl>
                      <Input placeholder="Software engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
