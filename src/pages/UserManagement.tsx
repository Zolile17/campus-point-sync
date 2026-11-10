import { useMemo, useState } from "react";
import { format, formatDistanceStrict, isSameDay } from "date-fns";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, UserPlus, CheckCircle2, Clock, UserX } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusPill } from "@/components/shared/StatusPill";
import { CAMPUSES, CAMPUS_NAMES } from "@/data/menu";
import { DEMO_NOW } from "@/lib/demoClock";

type UserStatus = "active" | "pending" | "inactive";
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  campus: string;
  terminal: string;
  status: UserStatus;
  lastLogin: Date | null;
}

const at = (daysAgo: number, h: number, m: number) =>
  new Date(DEMO_NOW.getFullYear(), DEMO_NOW.getMonth(), DEMO_NOW.getDate() - daysAgo, h, m);

const mockUsersInitial: User[] = [
  { id: "1", name: "Thabo Mkhize", email: "thabo.m@capsicum.co.za", role: "Cashier", campus: "Cape Town", terminal: "TERM-001", status: "active", lastLogin: at(0, 6, 52) },
  { id: "2", name: "Sarah Williams", email: "sarah.w@capsicum.co.za", role: "Cashier", campus: "Cape Town", terminal: "TERM-001", status: "active", lastLogin: at(1, 11, 58) },
  { id: "3", name: "Zanele Ndlovu", email: "zanele.n@capsicum.co.za", role: "Cashier", campus: "Durban", terminal: "TERM-002", status: "active", lastLogin: at(0, 6, 47) },
  { id: "4", name: "Michael Chen", email: "michael.c@capsicum.co.za", role: "Cashier", campus: "Durban", terminal: "TERM-002", status: "active", lastLogin: at(1, 12, 4) },
  { id: "5", name: "Lindiwe Khumalo", email: "lindiwe.k@capsicum.co.za", role: "Cashier", campus: "Nelson Mandela Bay", terminal: "TERM-003", status: "active", lastLogin: at(0, 6, 55) },
  { id: "6", name: "David van der Merwe", email: "david.v@capsicum.co.za", role: "Cashier", campus: "Pretoria", terminal: "TERM-004", status: "active", lastLogin: at(0, 6, 49) },
  { id: "7", name: "Amina Osman", email: "amina.o@capsicum.co.za", role: "Cashier", campus: "Pretoria", terminal: "TERM-004", status: "active", lastLogin: at(1, 11, 45) },
  { id: "8", name: "Johan Botha", email: "johan.b@capsicum.co.za", role: "Campus Supervisor", campus: "Cape Town", terminal: "—", status: "active", lastLogin: at(0, 7, 12) },
  { id: "9", name: "Fatima Patel", email: "fatima.p@capsicum.co.za", role: "Campus Supervisor", campus: "Durban", terminal: "—", status: "active", lastLogin: at(0, 7, 31) },
  { id: "10", name: "Nkosi Dlamini", email: "nkosi.d@capsicum.co.za", role: "Cashier", campus: "Cape Town", terminal: "TERM-001", status: "pending", lastLogin: null },
  { id: "11", name: "Lisa Thompson", email: "lisa.t@capsicum.co.za", role: "Campus Supervisor", campus: "Nelson Mandela Bay", terminal: "—", status: "active", lastLogin: at(1, 16, 5) },
  { id: "12", name: "Ahmed Ismail", email: "ahmed.i@capsicum.co.za", role: "Cashier", campus: "Durban", terminal: "TERM-002", status: "inactive", lastLogin: at(22, 11, 20) },
  { id: "13", name: "Palesa Mokoena", email: "palesa.m@capsicum.co.za", role: "Campus Supervisor", campus: "Pretoria", terminal: "—", status: "pending", lastLogin: null },
];

const formatLogin = (d: Date | null) => {
  if (!d) return { main: "Never", sub: "Awaiting approval" };
  if (isSameDay(d, DEMO_NOW)) return { main: `Today, ${format(d, "HH:mm")}`, sub: formatDistanceStrict(d, DEMO_NOW, { addSuffix: true }) };
  return { main: format(d, "EEE d MMM, HH:mm"), sub: formatDistanceStrict(d, DEMO_NOW, { addSuffix: true }) };
};

const initials = (name: string) => name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const emptyNewUser = { name: "", email: "", role: "Cashier", campus: "Cape Town", terminal: "TERM-001" };

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(mockUsersInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState(emptyNewUser);

  const handleAddUser = () => {
    const userToAdd: User = {
      id: String(Date.now()),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      campus: newUser.campus,
      terminal: newUser.role === "Cashier" ? newUser.terminal : "—",
      status: "pending",
      lastLogin: null,
    };
    setUsers([userToAdd, ...users]);
    toast.success(`${newUser.name} added`, {
      description: "Pending approval from a Group Admin before they can sign in.",
    });
    setIsAddUserOpen(false);
    setNewUser(emptyNewUser);
  };

  const handleApproveUser = (userId: string, userName: string) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, status: "active" } : u)));
    toast.success(`${userName} approved`, { description: "They've been emailed their sign-in details." });
  };

  const handleRejectUser = (userId: string, userName: string) => {
    setUsers(users.filter((u) => u.id !== userId));
    toast(`${userName}'s request was rejected`, { description: "The account has been removed." });
  };

  const filteredUsers = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.terminal.toLowerCase().includes(q)) &&
        (campusFilter === "all" || u.campus === campusFilter) &&
        (roleFilter === "all" || u.role === roleFilter) &&
        (statusFilter === "all" || u.status === statusFilter),
    );
  }, [users, searchTerm, campusFilter, roleFilter, statusFilter]);

  const pending = users.filter((u) => u.status === "pending").length;
  const signedInToday = users.filter((u) => u.lastLogin && isSameDay(u.lastLogin, DEMO_NOW)).length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="People"
        title="User Management"
        description="Cashiers and supervisors across all Capsicum campuses"
        actions={
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add user
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add a new user</DialogTitle>
                <DialogDescription>Create a cashier or supervisor account. New users start as pending until approved.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" placeholder="e.g. Naledi Sithole" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="naledi.s@capsicum.co.za" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cashier">Cashier</SelectItem>
                        <SelectItem value="Campus Supervisor">Campus Supervisor</SelectItem>
                        <SelectItem value="Group Admin">Group Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Campus</Label>
                    <Select
                      value={newUser.campus}
                      onValueChange={(v) => setNewUser({ ...newUser, campus: v, terminal: CAMPUSES.find((c) => c.name === v)!.terminal })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CAMPUS_NAMES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {newUser.role === "Cashier" && (
                  <div className="grid gap-2">
                    <Label>Terminal</Label>
                    <Select value={newUser.terminal} onValueChange={(v) => setNewUser({ ...newUser, terminal: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {CAMPUSES.map((c) => (
                          <SelectItem key={c.terminal} value={c.terminal}>{c.terminal} · {c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <p className="rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                  The user will receive an email once a Group Admin approves the account.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser} disabled={!newUser.name || !newUser.email}>Add user</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard tone="info" title="Total users" value={String(users.length)} icon={Users} description={`${users.filter((u) => u.role === "Cashier").length} cashiers`} />
        <StatsCard tone="success" title="Active" value={String(users.filter((u) => u.status === "active").length)} icon={CheckCircle2} description={`${signedInToday} signed in today`} />
        <StatsCard tone="warning" title="Pending approval" value={String(pending)} icon={Clock} description={pending ? "Needs your review" : "All caught up"} />
        <StatsCard tone="neutral" title="Inactive" value={String(users.filter((u) => u.status === "inactive").length)} icon={UserX} description="Access disabled" />
      </div>

      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name, email or terminal…" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-9 pl-9" />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
            <Select value={campusFilter} onValueChange={setCampusFilter}>
              <SelectTrigger className="h-9 lg:w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All campuses</SelectItem>
                {CAMPUS_NAMES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="h-9 lg:w-[170px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="Cashier">Cashier</SelectItem>
                <SelectItem value="Campus Supervisor">Campus Supervisor</SelectItem>
                <SelectItem value="Group Admin">Group Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 lg:w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 pl-5 text-xs font-medium uppercase tracking-wide">User</TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Role</TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Campus</TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Terminal</TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Status</TableHead>
                <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Last login</TableHead>
                <TableHead className="h-10 pr-5 text-right text-xs font-medium uppercase tracking-wide">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-14 text-center text-sm text-muted-foreground">No users match these filters.</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => {
                  const login = formatLogin(u.lastLogin);
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="pl-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{initials(u.name)}</div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{u.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="whitespace-nowrap font-medium">{u.role}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{u.campus}</TableCell>
                      <TableCell className="font-mono text-[13px]">{u.terminal}</TableCell>
                      <TableCell><StatusPill status={u.status} /></TableCell>
                      <TableCell className="whitespace-nowrap">
                        <p className="text-sm">{login.main}</p>
                        <p className="text-xs text-muted-foreground">{login.sub}</p>
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        {u.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <Button size="sm" className="h-8" onClick={() => handleApproveUser(u.id, u.name)}>Approve</Button>
                            <Button size="sm" variant="outline" className="h-8 hover:border-brand hover:text-brand" onClick={() => handleRejectUser(u.id, u.name)}>
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-8" onClick={() => toast("Editing is disabled in this demo")}>Edit</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </section>
    </div>
  );
};

export default UserManagement;
