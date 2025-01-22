import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { queryClient } from "~/utils/tanstack";
import {
  getUserQueryData,
  sessionQueryOptions,
  userQueryOptions,
} from "~/stores/session";

interface MyRouterContext {}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // makes sure the session data and user data (if any) are fetched before rendering the app
    const session = await queryClient.ensureQueryData(sessionQueryOptions);

    if (session) {
      await queryClient.ensureQueryData(userQueryOptions);
    }
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
