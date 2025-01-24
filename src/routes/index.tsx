import { createFileRoute } from "@tanstack/react-router";
import { getApplications } from "../utils/appwrite";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { requireAuth, useUser } from "~/stores/session";
import { TypographyH1 } from "~/components/Typography";
import { Application } from "~/components/Application";
import {
  ApplicationDeletionModal,
  ApplicationEditionModal,
} from "~/components/Application";
import { InferQueryFnType } from "~/types";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  beforeLoad() {
    requireAuth();
  },
});

const applicationsQueryOptions = queryOptions({
  queryKey: ["applications"],
  queryFn: () => {
    return getApplications();
  },
});
export type ApplicationsQueryReturn = InferQueryFnType<
  typeof applicationsQueryOptions.queryFn
>;

function HomeComponent() {
  const user = useUser()?.data;
  const applicationsQuery = useQuery(applicationsQueryOptions);

  return (
    <main className="p-4 w-full">
      <div className="grid justify-start gap-4 pt-10">
        <ApplicationDeletionModal />

        <TypographyH1>
          <span>Welcome {user?.name}</span>
        </TypographyH1>

        <div className="flex">
          <ApplicationEditionModal trigger={true} />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mt-6">
        {applicationsQuery.data?.documents?.map((application) => (
          <Application key={application.$id} application={application} />
        ))}
      </div>
    </main>
  );
}
