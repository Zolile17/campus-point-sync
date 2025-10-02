import { LayoutDashboard, TrendingUp, Users, Building2, LogOut, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import capsicumLogo from "@/assets/capsicum-logo.png";
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
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Metrics",
    url: "/metrics",
    icon: TrendingUp,
  },
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Brand Management",
    url: "/brands",
    icon: Building2,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b border-sidebar-border p-6">
        <div className="flex items-center gap-3">
          <img src={capsicumLogo} alt="Capsicum" className="h-12 w-auto object-contain" />
        
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
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted/50"
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
      
      {/* User Profile Section */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-600/10 to-black/10">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-600 to-black flex items-center justify-center text-white font-bold">
              GA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Group Amin</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
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