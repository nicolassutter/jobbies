import { Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { ensureUserQueryData } from "~/stores/session";
import { AppSidebar } from "~/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

type MyRouterContext = { [key: string]: never };

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // makes sure the user data (if any) is fetched before rendering the app
    await ensureUserQueryData();
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
