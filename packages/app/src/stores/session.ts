import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getSession, getUser, logout } from "../utils/appwrite";
import { queryClient } from "~/utils/tanstack";
import { redirect, useNavigate } from "@tanstack/react-router";

// Fetch the session data on app load.
export const sessionQueryOptions = queryOptions({
  queryKey: ["session"],
  queryFn: async () => {
    const session = await getSession();
    return session;
  },
  retry: false,
});

export const userQueryOptions = queryOptions({
  queryKey: ["user"],
  queryFn: async () => {
    return getUser();
  },
});

/** Get session in cache */
export const getSessionQueryData = () => {
  return queryClient.getQueryData(sessionQueryOptions.queryKey);
};
/** Get user in cache */
export const getUserQueryData = () =>
  queryClient.getQueryData(userQueryOptions.queryKey);

export const useSession = () => useQuery(sessionQueryOptions);
export const useUser = () => useQuery(userQueryOptions);

export const useLogout = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logout(),
    onSuccess() {
      queryClient.setQueryData(sessionQueryOptions.queryKey, null);
      queryClient.setQueryData(userQueryOptions.queryKey, null);
      navigate({ to: "/login" });
    },
  });
};

export const requireAuth = () => {
  // gets the user in cache, does not make a new request
  const user = getUserQueryData();

  if (!user) {
    throw redirect({
      to: "/login",
      search: {
        redirect: location.href,
      },
    });
  }
};
