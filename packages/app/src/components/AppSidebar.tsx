import { Home, LogOut, PieChart /*, Settings */ } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { useAuth } from '~/stores/session'

type MenuItem = {
  title: string
  icon: React.ComponentType
  url?: string
  onClick?: () => void
}

function AppSidebarMenuItem(item: MenuItem) {
  const Tag = item.url ? Link : 'button'

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Tag
          to={item.url}
          onClick={item.onClick}
        >
          <item.icon />
          <span>{item.title}</span>
        </Tag>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { logout } = useAuth()
  const { setOpenMobile } = useSidebar()
  const defaultOnClick = () => setOpenMobile(false)

  const items: MenuItem[] = [
    {
      title: 'Home',
      url: '/',
      icon: Home,
      onClick: defaultOnClick,
    },
    {
      title: 'Stats',
      url: '/stats',
      icon: PieChart,
      onClick: defaultOnClick,
    },
    //{
    //  title: 'Settings',
    //  url: '/settings',
    //  icon: Settings,
    //},
  ]

  return (
    <Sidebar
      collapsible='icon'
      className='grow-0'
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <AppSidebarMenuItem
                  key={item.title}
                  {...item}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <AppSidebarMenuItem
            title='Logout'
            onClick={() => logout.mutate()}
            icon={LogOut}
          />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
