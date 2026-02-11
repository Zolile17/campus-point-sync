import { LayoutDashboard, TrendingUp, Users, Building2, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import intellergyLogo from "@/assets/intellergy-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Metrics", url: "/metrics", icon: TrendingUp },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Brand Management", url: "/brands", icon: Building2 },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex flex-col gap-2">
          <img src={intellergyLogo} alt="Intellergy Cafe" className="h-10 w-auto object-contain" />
          <div className="flex flex-col gap-0.5 items-center text-center">
            <span className="text-base font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-800 bg-clip-text text-transparent">
              Intellergy Cafe
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        isActive
                          ? "bg-gradient-to-r from-green-600/90 to-green-700/90 text-white font-semibold shadow-sm hover:from-green-700 hover:to-green-800"
                          : "hover:bg-green-50 dark:hover:bg-green-950/20 hover:text-green-700 dark:hover:text-green-400"
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-600/20">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white font-bold shadow-sm">
              GA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Group Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}