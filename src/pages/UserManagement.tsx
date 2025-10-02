import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Users, Search, UserPlus, CheckCircle2, XCircle, Clock } from "lucide-react";

const mockUsersInitial = [
  { id: "1", name: "Thabo Mkhize", email: "thabo.m@capsicum.co.za", role: "Cashier", campus: "Cape Town", terminal: "TERM-001", status: "active", lastLogin: "2025-10-01 09:23" },
  { id: "2", name: "Sarah Williams", email: "sarah.w@capsicum.co.za", role: "Cashier", campus: "Cape Town", terminal: "TERM-001", status: "active", lastLogin: "2025-10-01 14:45" },
  { id: "3", name: "Zanele Ndlovu", email: "zanele.n@capsicum.co.za", role: "Cashier", campus: "Durban", terminal: "TERM-002", status: "active", lastLogin: "2025-10-01 13:12" },
  { id: "4", name: "Michael Chen", email: "michael.c@capsicum.co.za", role: "Cashier", campus: "Durban", terminal: "TERM-002", status: "active", lastLogin: "2025-10-01 08:30" },
  { id: "5", name: "Lindiwe Khumalo", email: "lindiwe.k@capsicum.co.za", role: "Cashier", campus: "Nelson Mandela Bay", terminal: "TERM-003", status: "active", lastLogin: "2025-10-01 10:15" },
  { id: "6", name: "David van der Merwe", email: "david.v@capsicum.co.za", role: "Cashier", campus: "Pretoria", terminal: "TERM-004", status: "active", lastLogin: "2025-10-01 12:40" },
  { id: "7", name: "Amina Osman", email: "amina.o@capsicum.co.za", role: "Cashier", campus: "Pretoria", terminal: "TERM-004", status: "active", lastLogin: "2025-10-01 15:20" },
  { id: "8", name: "Johan Botha", email: "johan.b@capsicum.co.za", role: "Campus Supervisor", campus: "Cape Town", terminal: "-", status: "active", lastLogin: "2025-10-01 07:15" },
  { id: "9", name: "Fatima Patel", email: "fatima.p@capsicum.co.za", role: "Campus Supervisor", campus: "Durban", terminal: "-", status: "active", lastLogin: "2025-10-01 07:30" },
  { id: "10", name: "Nkosi Dlamini", email: "nkosi.d@capsicum.co.za", role: "Cashier", campus: "Cape Town", terminal: "TERM-001", status: "pending", lastLogin: "-" },
  { id: "11", name: "Lisa Thompson", email: "lisa.t@capsicum.co.za", role: "Campus Supervisor", campus: "Nelson Mandela Bay", terminal: "-", status: "active", lastLogin: "2025-09-30 16:45" },
  { id: "12", name: "Ahmed Ismail", email: "ahmed.i@capsicum.co.za", role: "Cashier", campus: "Durban", terminal: "TERM-002", status: "inactive", lastLogin: "2025-09-28 11:20" },
];

const UserManagement = () => {
  const [users, setUsers] = useState(mockUsersInitial);
  const [searchTerm, setSearchTerm] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Cashier",
    campus: "Cape Town",
    terminal: "TERM-001"
  });

  const handleAddUser = () => {
    // Create new user object
    const userToAdd = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      campus: newUser.campus,
      terminal: newUser.role === "Cashier" ? newUser.terminal : "-",
      status: "pending",
      lastLogin: "-"
    };
    
    // Add to users array
    setUsers([...users, userToAdd]);
    
    const terminalInfo = newUser.role === "Cashier" ? `\nTerminal: ${newUser.terminal}` : "";
    alert(`✅ User Created Successfully!\n\nName: ${newUser.name}\nEmail: ${newUser.email}\nRole: ${newUser.role}\nCampus: ${newUser.campus}${terminalInfo}\n\n⏳ STATUS: PENDING APPROVAL\n\n⚠️ This user requires approval from a Group Admin before they can access the system. The user will receive an email notification once approved.`);
    setIsAddUserOpen(false);
    
    // Reset form
    setNewUser({
      name: "",
      email: "",
      role: "Cashier",
      campus: "Cape Town",
      terminal: "TERM-001"
    });
  };

  const handleApproveUser = (userId: string, userName: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: "active", lastLogin: new Date().toLocaleString('en-ZA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }) } : u
    ));
    alert(`✅ User Approved!\n\n${userName} has been approved and can now access the system. An email notification has been sent.`);
  };

  const handleRejectUser = (userId: string, userName: string) => {
    setUsers(users.filter(u => u.id !== userId));
    alert(`❌ User Rejected!\n\n${userName}'s request has been denied and removed from the system.`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.terminal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCampus = campusFilter === "all" || user.campus === campusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesCampus && matchesRole && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4" />;
      case "inactive":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "active":
        return "default";
      case "inactive":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-black bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">Manage cashiers and supervisors across all campuses</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => u.status === "active").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {users.filter(u => u.status === "pending").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cashiers</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === "Cashier").length}
                </p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or terminal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900">
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new cashier or supervisor account. User will be pending approval.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@capsicum.co.za"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cashier">Cashier</SelectItem>
                          <SelectItem value="Campus Supervisor">Campus Supervisor</SelectItem>
                          <SelectItem value="Group Admin">Group Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="campus">Campus</Label>
                      <Select value={newUser.campus} onValueChange={(value) => setNewUser({...newUser, campus: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cape Town">Cape Town</SelectItem>
                          <SelectItem value="Durban">Durban</SelectItem>
                          <SelectItem value="Nelson Mandela Bay">Nelson Mandela Bay</SelectItem>
                          <SelectItem value="Pretoria">Pretoria</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {newUser.role === "Cashier" && (
                      <div className="grid gap-2">
                        <Label htmlFor="terminal">Terminal ID</Label>
                        <Select value={newUser.terminal} onValueChange={(value) => setNewUser({...newUser, terminal: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TERM-001">TERM-001 </SelectItem>
                            <SelectItem value="TERM-002">TERM-002 </SelectItem>
                            <SelectItem value="TERM-003">TERM-003 </SelectItem>
                            <SelectItem value="TERM-004">TERM-004 </SelectItem>
                             <SelectItem value="TERM-001">TERM-005 </SelectItem>
                            <SelectItem value="TERM-002">TERM-006 </SelectItem>
                            <SelectItem value="TERM-003">TERM-007 </SelectItem>
                            <SelectItem value="TERM-004">TERM-008 </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <p className="text-sm text-orange-800 dark:text-orange-200">
                        <strong>Note:</strong> New users will be created with "Pending Approval" status and require approval from a Group Admin before they can access the system.
                      </p>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddUser}
                      disabled={!newUser.name || !newUser.email}
                      className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
                    >
                      Add User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={campusFilter} onValueChange={setCampusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Campuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Cape Town">Cape Town</SelectItem>
                  <SelectItem value="Durban">Durban</SelectItem>
                  <SelectItem value="Nelson Mandela Bay">Nelson Mandela Bay</SelectItem>
                  <SelectItem value="Pretoria">Pretoria</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Campus Supervisor">Campus Supervisor</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Campus</TableHead>
                  <TableHead className="font-semibold">Terminal</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Last Login</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-sm">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.campus}</TableCell>
                      <TableCell className="font-mono text-sm">{user.terminal}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusVariant(user.status)}
                          className="gap-1 capitalize"
                        >
                          {getStatusIcon(user.status)}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        {user.status === "pending" ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleApproveUser(user.id, user.name)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleRejectUser(user.id, user.name)}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;