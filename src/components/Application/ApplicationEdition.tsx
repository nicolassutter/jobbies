import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ApplicationDocument,
  ApplicationSchema,
  createApplication,
  statuses,
  updateApplication,
  type Application,
} from "~/utils/appwrite";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { ButtonLoader } from "../Loaders";
import { FunctionComponent, useEffect, useRef } from "react";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { produce } from "immer";
import { ApplicationsQueryReturn } from "~/utils/queries";
import { DialogClose } from "@radix-ui/react-dialog";
import { PlusCircle } from "lucide-react";

type Mode = "edition" | "creation";

export const useApplicationEditionModal = create(
  combine(
    {
      application: undefined as ApplicationDocument | undefined,
      mode: "creation" as Mode,
      isOpen: false,
    },
    (set) => ({
      open: (mode: Mode, application?: ApplicationDocument) => {
        return set(() => ({ application, mode, isOpen: true }));
      },
      close: () => {
        return set(() => ({
          application: undefined,
          mode: "creation",
          isOpen: false,
        }));
      },
    }),
  ),
);

export const ApplicationEditionModal: FunctionComponent<{
  trigger: boolean;
}> = (props) => {
  const modalState = useApplicationEditionModal();

  const defaultValues: Application = {
    // string values need to be initialized to empty string for controlled inputs
    job_title: modalState.application?.job_title ?? "",
    url: modalState.application?.url ?? "",
    notes: modalState.application?.notes ?? "",
    application_status: modalState.application?.application_status,
  };

  const form = useForm<Application>({
    resolver: zodResolver(ApplicationSchema),
    defaultValues,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    // make sure the default values are fresh
    // @see https://react-hook-form.com/docs/useform/reset
    form.reset(defaultValues);
  }, [modalState.isOpen]);

  const createMutation = useMutation({
    mutationFn: (application: Application) => {
      return createApplication(application);
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
      modalState.close();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      applicationId,
      application,
    }: {
      applicationId: string;
      application: Application;
    }) => {
      return updateApplication(applicationId, application);
    },
    async onSuccess(updatedApplication) {
      // update the cache with the new application
      const cache = queryClient.getQueryData<ApplicationsQueryReturn>([
        "applications",
      ]);

      if (!cache) return;

      const idx = cache.documents.findIndex(
        (doc) => doc.$id === modalState.application?.$id,
      );

      if (idx === -1) return;

      const newCache = produce(cache, (draft) => {
        draft.documents[idx] = updatedApplication;
      });
      queryClient.setQueryData(["applications"], newCache);
      modalState.close();
    },
  });

  async function onSubmit(values: Application) {
    if (modalState.mode === "edition") {
      if (!modalState.application) return;

      return await updateMutation.mutateAsync({
        applicationId: modalState.application.$id,
        application: values,
      });
    }

    if (modalState.mode === "creation") {
      return await createMutation.mutateAsync(values);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const cancelBtn = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={modalState.isOpen}
      onOpenChange={(status) => {
        // open
        if (!modalState.isOpen && status) {
          modalState.open(modalState.mode, modalState.application);
        }

        // close
        if (modalState.isOpen && !status) {
          modalState.close();
        }
      }}
    >
      {props.trigger && (
        <DialogTrigger asChild>
          <Button>
            <PlusCircle />
            New application
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className="w-full max-w-2xl"
        onOpenAutoFocus={(e) => {
          // in edition mode, focus the cancel button instead of  the first input
          if (modalState.mode === "edition") {
            e.preventDefault();
            cancelBtn.current?.focus?.();
          }
        }}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values) => onSubmit(values))}>
            <DialogHeader>
              <DialogTitle>New application</DialogTitle>
              <DialogDescription>
                Provide some details about the job you&apos;re applying for.
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
                      {/* a field value cannot be null */}
                      <Input
                        placeholder="https://"
                        {...field}
                        value={field.value ?? undefined}
                      />
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
                      You might be able to use Makdown here at some point. I
                      just need to parse it on the server.
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
                          <SelectItem key={status} value={status.toLowerCase()}>
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
              <DialogClose asChild>
                <Button variant="secondary" ref={cancelBtn}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                Save changes
                {isPending && <ButtonLoader />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
