import { createFileRoute } from "@tanstack/react-router";
import { getApplications } from "../utils/appwrite";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ApplicationCreationModal } from "~/components/ApplicationCreationModal";
import { useQuery } from "@tanstack/react-query";
import { requireAuth, useLogout, useSession, useUser } from "~/stores/session";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad() {
    requireAuth();
  },
});

function HomeComponent() {
  const session = useSession()?.data;
  const user = useUser()?.data;
  const logout = useLogout();

  const applicationsQuery = useQuery({
    queryKey: ["applications", session?.userId],
    queryFn: () => {
      return getApplications();
    },
  });

  return (
    <>
      <Button
        onClick={() => {
          logout.mutate();
        }}
      >
        Logout
      </Button>

      <ApplicationCreationModal />

      <div className="grid gap-2 grid-cols-4">
        {user ? "Logged in as" + user?.name : "no session"}
        {applicationsQuery.data?.documents?.map((application) => (
          <Card key={application.$id}>
            <CardHeader>
              <CardTitle>{application.job_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{application.notes}</p>
            </CardContent>
            <CardFooter>
              <p>{application.application_status}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
