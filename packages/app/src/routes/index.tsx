import { createFileRoute } from "@tanstack/react-router";
import { requireAuth, useUser } from "~/stores/session";
import { Application } from "~/components/Application";
import {
  ApplicationDeletionModal,
  ApplicationEditionModal,
} from "~/components/Application";
import { trpc } from "~/utils/trpc.client";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad() {
    requireAuth();
  },
});

function HomeComponent() {
  const user = useUser()?.data?.user;
  const applicationsQuery = trpc.applications.read.useQuery();

  return (
    <main className="p-4 w-full">
      <div className="grid justify-start gap-4 pt-10">
        <ApplicationDeletionModal />

        <h1 className="h1">Welcome {user?.name}</h1>

        <div className="flex">
          <ApplicationEditionModal trigger={true} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-6">
        {applicationsQuery.data?.map((application) => (
          <Application key={application.id} application={application} />
        ))}
      </div>
    </main>
  );
}
