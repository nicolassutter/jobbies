import { Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { queryClient } from "~/utils/tanstack";
import { sessionQueryOptions, userQueryOptions } from "~/stores/session";
import { AppSidebar } from "~/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

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
  const loc = useLocation();
  const showSidebar = loc.pathname !== "/login";

  return (
    <>
      <div className="flex">
        {showSidebar && (
          <div className="sidebar-container relative">
            <SidebarProvider>
              <AppSidebar />

              <div className="absolute left-full ml-2">
                <SidebarTrigger />
              </div>
            </SidebarProvider>
          </div>
        )}

        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
