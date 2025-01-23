import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FunctionComponent } from "react";
import { ApplicationDocument, deleteApplication } from "~/utils/appwrite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Edit, Edit2, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const Application: FunctionComponent<{
  application: ApplicationDocument;
}> = ({ application }) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteApplication(id);
    },
    // TODO: optimistic update
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ["applications"],
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex gap-2 justify-between">
          <CardTitle>{application.job_title}</CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"icon"} className="shrink-0">
                <Edit />
                <span className="sr-only">Open edition menu</span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Application actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  console.log("edit");
                }}
              >
                <Edit2 />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  deleteMutation.mutate(application.$id);
                }}
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <p>{application.notes}</p>
      </CardContent>
      <CardFooter>
        <p>{application.application_status}</p>
      </CardFooter>
    </Card>
  );
};
