import { createFileRoute } from "@tanstack/react-router";
import { getApplications } from "../utils/appwrite";
import { ApplicationCreationModal } from "~/components/ApplicationCreationModal";
import { useQuery } from "@tanstack/react-query";
import { requireAuth, useSession, useUser } from "~/stores/session";
import { TypographyH1 } from "~/components/Typography";
import { Application } from "~/components/Application";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad() {
    requireAuth();
  },
});

function HomeComponent() {
  const session = useSession()?.data;
  const user = useUser()?.data;

  const applicationsQuery = useQuery({
    queryKey: ["applications", session?.userId],
    queryFn: () => {
      return getApplications();
    },
  });

  return (
    <main className="p-4">
      <div className="grid justify-start gap-2 pt-10">
        <ApplicationCreationModal />
        <TypographyH1 className="mt-6">
          <span>Welcome {user?.name}</span>
        </TypographyH1>
      </div>

      <div className="grid gap-2 grid-cols-4 mt-6">
        {applicationsQuery.data?.documents?.map((application) => (
          <Application key={application.$id} application={application} />
        ))}
      </div>
    </main>
  );
}
