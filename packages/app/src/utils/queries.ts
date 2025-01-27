// this file contains global queries that are used multiple times
import { queryOptions, useQuery } from "@tanstack/react-query";
import { InferQueryFnType } from "~/types";
import { getApplications } from "./appwrite";

const applicationsQueryOptions = queryOptions({
  queryKey: ["applications"],
  queryFn: () => {
    return getApplications();
  },
});
export const useApplicationsQuery = () => useQuery(applicationsQueryOptions);

export type ApplicationsQueryReturn = InferQueryFnType<
  typeof applicationsQueryOptions.queryFn
>;
