import { Home, LogOut, PieChart, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLogout } from "~/stores/session";
import { Link } from "@tanstack/react-router";

type MenuItem = {
  title: string;
  icon: React.ComponentType;
  url?: string;
  onClick?: () => void;
};

export function AppSidebar() {
  const logout = useLogout();

  const items: MenuItem[] = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Stats",
      url: "/stats",
      icon: PieChart,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Logout",
      onClick: () => {
        logout.mutate();
      },
      icon: LogOut,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="grow-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Tag = item.url ? Link : "button";

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Tag to={item.url} onClick={item.onClick}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Tag>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
