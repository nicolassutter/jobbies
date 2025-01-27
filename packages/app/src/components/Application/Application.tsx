import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FunctionComponent, useMemo } from "react";
import { ApplicationDocument } from "~/utils/appwrite";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Edit2, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "~/lib/utils";
import {
  useApplicationEditionModal,
  useApplicationDeletionModal,
} from "@/components/Application/index";
import DOMPurify from "dompurify";
import { marked } from "~/utils/marked";

export const Application: FunctionComponent<{
  application: ApplicationDocument;
}> = ({ application }) => {
  const deletionModal = useApplicationDeletionModal();
  const editionModal = useApplicationEditionModal();
  const notes = useMemo(
    () =>
      application.notes
        ? DOMPurify.sanitize(
            marked.parse(application.notes, {
              async: false,
            }),
          )
        : null,
    [application.notes],
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex gap-2 justify-between">
            <CardTitle>
              <h2>{application.job_title}</h2>
            </CardTitle>

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
                    editionModal.open("edition", application);
                  }}
                >
                  <Edit2 />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    deletionModal.open(application.$id);
                  }}
                >
                  <Trash />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {notes && (
          <CardContent>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: notes }}
            ></div>
          </CardContent>
        )}

        {application.application_status && (
          <CardFooter>
            <Badge>{capitalize(application.application_status)}</Badge>
          </CardFooter>
        )}
      </Card>
    </>
  );
};
