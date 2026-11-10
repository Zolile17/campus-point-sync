import { LayoutDashboard, BarChart3, Users, Building2, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import logoLight from "@/assets/capsicum-logo-light.png";
import pepper from "@/assets/capsicum-pepper.png";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";

export const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Metrics", url: "/metrics", icon: BarChart3 },
  { title: "User Management", url: "/users", icon: Users },
  { title: "Brand Management", url: "/brands", icon: Building2 },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="px-4 pb-4 pt-5 group-data-[collapsible=icon]:px-2">
        {collapsed ? (
          <img src={pepper} alt="Capsicum" className="mx-auto h-8 w-8 object-contain" />
        ) : (
          <div className="space-y-3">
            <img src={logoLight} alt="Capsicum Culinary Studio" className="h-9 w-auto object-contain object-left" />
            <div className="flex items-center gap-2 rounded-md border border-sidebar-border px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-sidebar-primary" />
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-sidebar-foreground">
                Campus Deli
              </span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-[0.12em] text-sidebar-foreground/60">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const isActive = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="relative h-9 text-sidebar-foreground transition-colors data-[active=true]:bg-sidebar-accent data-[active=true]:text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-full before:bg-sidebar-primary before:opacity-0 data-[active=true]:before:opacity-100 group-data-[collapsible=icon]:before:hidden"
                    >
                      <NavLink to={item.url}>
                        <item.icon className={isActive ? "text-sidebar-primary" : ""} />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {collapsed ? (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-semibold text-neutral-900">
            GA
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold text-neutral-900">
              GA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Group Admin</p>
              <p className="truncate text-xs text-sidebar-foreground">admin@capsicum.co.za</p>
            </div>
            <button
              type="button"
              aria-label="Log out"
              onClick={() => toast("Signed out", { description: "This is a demo — you're still logged in." })}
              className="rounded-md p-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
