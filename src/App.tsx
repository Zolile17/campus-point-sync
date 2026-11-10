import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, useTheme } from "next-themes";
import { format } from "date-fns";
import { Moon, Sun } from "lucide-react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar, menuItems } from "@/components/AppSidebar";
import { DEMO_NOW } from "@/lib/demoClock";
import Index from "./pages/Index";
import Metrics from "./pages/Metrics";
import UserManagement from "./pages/UserManagement";
import BrandManagement from "./pages/BrandManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};

const TopBar = () => {
  const { pathname } = useLocation();
  const current = menuItems.find((m) => (m.url === "/" ? pathname === "/" : pathname.startsWith(m.url)));

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex min-w-0 items-center gap-1.5 text-sm">
        <span className="hidden text-muted-foreground sm:inline">Capsicum</span>
        <span className="hidden text-muted-foreground/50 sm:inline">/</span>
        <span className="truncate font-medium">{current?.title ?? "Not found"}</span>
      </div>
      <div className="flex-1" />
      <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground md:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-live-ping rounded-full bg-brand" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
        </span>
        <span className="font-medium text-foreground">Live</span>
        <span>·</span>
        <span className="tabular">{format(DEMO_NOW, "EEE d MMM yyyy, HH:mm")}</span>
      </div>
      <ThemeToggle />
    </header>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0 bg-background">
              <TopBar />
              <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/metrics" element={<Metrics />} />
                  <Route path="/users" element={<UserManagement />} />
                  <Route path="/brands" element={<BrandManagement />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </SidebarInset>
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
