import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Users, Plus, Settings, Monitor, Banknote } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CAMPUS_COLOR } from "@/components/shared/chart";
import { CAMPUSES } from "@/data/menu";
import { mockTransactions } from "@/data/mockTransactions";
import { DEMO_NOW, formatRand } from "@/lib/demoClock";
import { sameTimeOnDay, summarise, windowDays } from "@/lib/analytics";
import { format } from "date-fns";

interface CampusCard {
  id: string;
  name: string;
  fullName: string;
  address: string;
  terminal: string;
  activeUsers: number;
  status: "active" | "setup";
  todayCount: number;
  todayRevenue: number;
  monthRevenue: number;
}

const ACTIVE_USERS: Record<string, number> = { "Cape Town": 3, Durban: 3, "Nelson Mandela Bay": 2, Pretoria: 2 };

const BrandManagement = () => {
  const initial = useMemo<CampusCard[]>(() => {
    const today = sameTimeOnDay(mockTransactions, 0);
    const month = windowDays(mockTransactions, 29, 0);
    return CAMPUSES.map((c, i) => {
      const t = summarise(today.filter((x) => x.campus === c.name));
      const m = summarise(month.filter((x) => x.campus === c.name));
      return {
        id: String(i + 1),
        name: c.name,
        fullName: c.fullName,
        address: c.address,
        terminal: c.terminal,
        activeUsers: ACTIVE_USERS[c.name] ?? 0,
        status: "active",
        todayCount: t.count,
        todayRevenue: t.revenue,
        monthRevenue: m.revenue,
      };
    });
  }, []);

  const [campuses, setCampuses] = useState<CampusCard[]>(initial);
  const [isAddCampusOpen, setIsAddCampusOpen] = useState(false);
  const [newCampus, setNewCampus] = useState({ name: "", address: "", terminal: "" });

  const terminalTaken = campuses.some((c) => c.terminal === newCampus.terminal);

  const handleAddCampus = () => {
    setCampuses([
      ...campuses,
      {
        id: String(campuses.length + 1),
        name: newCampus.name,
        fullName: `Capsicum Culinary Studio · ${newCampus.name}`,
        address: newCampus.address,
        terminal: newCampus.terminal,
        activeUsers: 0,
        status: "setup",
        todayCount: 0,
        todayRevenue: 0,
        monthRevenue: 0,
      },
    ]);
    toast.success(`${newCampus.name} campus added`, { description: `Terminal ${newCampus.terminal} is ready to be paired.` });
    setIsAddCampusOpen(false);
    setNewCampus({ name: "", address: "", terminal: "" });
  };

  const totalRevenue = campuses.reduce((s, c) => s + c.monthRevenue, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Locations"
        title="Brand Management"
        description="Capsicum Culinary Studio campuses and their deli terminals"
        actions={
          <Dialog open={isAddCampusOpen} onOpenChange={setIsAddCampusOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add campus
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add a campus</DialogTitle>
                <DialogDescription>Register a new Capsicum Culinary Studio location and assign its terminal.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="campus-name">Campus name</Label>
                  <Input id="campus-name" placeholder="e.g. Rosebank" value={newCampus.name} onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="e.g. 50 Bath Avenue, Rosebank, Johannesburg, 2196" value={newCampus.address} onChange={(e) => setNewCampus({ ...newCampus, address: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="terminal">Terminal ID</Label>
                  <Input id="terminal" placeholder="e.g. TERM-005" value={newCampus.terminal} onChange={(e) => setNewCampus({ ...newCampus, terminal: e.target.value.toUpperCase() })} />
                  <p className={`text-xs ${terminalTaken ? "text-brand" : "text-muted-foreground"}`}>
                    {terminalTaken ? "That terminal is already assigned to another campus." : "Must be unique, e.g. TERM-005"}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCampusOpen(false)}>Cancel</Button>
                <Button onClick={handleAddCampus} disabled={!newCampus.name || !newCampus.address || !newCampus.terminal || terminalTaken}>
                  Add campus
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard tone="info" title="Campuses" value={String(campuses.length)} icon={Building2} description={`${campuses.filter((c) => c.status === "active").length} trading today`} />
        <StatsCard tone="teal" title="Active staff" value={String(campuses.reduce((s, c) => s + c.activeUsers, 0))} icon={Users} description="Cashiers and supervisors" />
        <StatsCard hero title="Payments · last 30 days" value={formatRand(totalRevenue, 0)} icon={Banknote} description="All campuses, approved" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {campuses.map((c) => (
          <article key={c.id} className="surface overflow-hidden transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-5 w-5" style={{ color: CAMPUS_COLOR[c.name] ?? "hsl(var(--foreground))" }} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold">{c.name}</h3>
                  <p className="mt-0.5 flex items-start gap-1 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>{c.address}</span>
                  </p>
                </div>
              </div>
              {c.status === "active" ? (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Trading
                </span>
              ) : (
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  Setting up
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 divide-x divide-border">
              <div className="p-4">
                <p className="eyebrow">Today</p>
                <p className="tabular mt-1 text-lg font-semibold">{formatRand(c.todayRevenue, 0)}</p>
                <p className="tabular text-xs text-muted-foreground">{c.todayCount} sales by {format(DEMO_NOW, "HH:mm")}</p>
              </div>
              <div className="p-4">
                <p className="eyebrow">30 days</p>
                <p className="tabular mt-1 text-lg font-semibold">{formatRand(c.monthRevenue, 0)}</p>
                <p className="tabular text-xs text-muted-foreground">
                  {totalRevenue ? ((c.monthRevenue / totalRevenue) * 100).toFixed(0) : 0}% of group
                </p>
              </div>
              <div className="p-4">
                <p className="eyebrow">Staff</p>
                <p className="tabular mt-1 text-lg font-semibold">{c.activeUsers}</p>
                <p className="text-xs text-muted-foreground">active users</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-5 py-3">
              <span className="flex items-center gap-2 text-xs text-muted-foreground">
                <Monitor className="h-3.5 w-3.5" />
                <span className="font-mono font-medium text-foreground">{c.terminal}</span>
              </span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => toast("Configuration is disabled in this demo")}>
                  <Settings className="h-3.5 w-3.5" /> Configure
                </Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => toast("Opening users is disabled in this demo")}>
                  <Users className="h-3.5 w-3.5" /> Users
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default BrandManagement;
