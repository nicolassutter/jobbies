import { FunctionComponent } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "~/utils/appwrite";
import { create } from "zustand";
import { ButtonLoader } from "../Loaders";
import { ApplicationsQueryReturn } from "~/routes";
import { produce } from "immer";
import { combine } from "zustand/middleware";

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
);

export const ApplicationDeletionModal: FunctionComponent<{}> = () => {
  const queryClient = useQueryClient();

  const { applicationId, isModalOpen, close } = useApplicationDeletionModal();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteApplication(id);
      return id;
    },
    async onSuccess(deletedId) {
      // remove the deleted application from the cache
      queryClient.setQueryData(
        ["applications"],
        (cache: ApplicationsQueryReturn | undefined) => {
          if (!cache) return;

          const newCache = produce(cache, (draft) => {
            draft.documents = draft.documents?.filter(
              (app) => app.$id !== deletedId,
            );
          });

          return newCache;
        },
      );

      close();
    },
  });

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(status) => {
        if (status) {
          applicationId && open(applicationId);
        } else {
          close();
        }
      }}
    >
      <DialogContent className="w-full max-w-lg">
        <DialogHeader>
          <DialogTitle>Delete application</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this application?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            variant={"destructive"}
            onClick={() => {
              if (applicationId) {
                deleteMutation.mutate(applicationId);
              }
            }}
          >
            Delete
            {deleteMutation.isPending && <ButtonLoader />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
