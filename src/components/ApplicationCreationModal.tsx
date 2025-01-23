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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApplicationSchema,
  applicationStatusEnum,
  createApplication,
  type Application,
} from "~/utils/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "./ui/textarea";
import { ButtonLoader } from "./Loaders";
import { useEffect, useState } from "react";
import { capitalize } from "~/lib/utils";

const statuses = applicationStatusEnum._def.values
  .toSorted((a, b) => a.localeCompare(b))
  .map((status) => capitalize(status));

export const ApplicationCreationModal = () => {
  const form = useForm<Application>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues: {
      job_title: "",
    },
  });
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isModalOpen) {
      form.reset();
    }
  }, [isModalOpen]);

  const createMutation = useMutation({
    mutationFn: (application: Application) => {
      return createApplication(application);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      setIsModalOpen(false);
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>New application</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-2xl">
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

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Url to job post or company</FormLabel>
                    <FormControl>
                      <Input placeholder="https://" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes about application</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Honesly, I'm not sure if I want this job."
                        rows={10}
                        maxLength={1000}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      You can use Makdown here if you wish.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="application_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status for this application" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">
                Save changes
                {createMutation.isPending && <ButtonLoader />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
