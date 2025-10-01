import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, UserPlus, CheckCircle2, XCircle, Clock } from "lucide-react";

const mockUsers = [
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
  const [searchTerm, setSearchTerm] = useState("");
  const [campusFilter, setCampusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter((user) => {
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
                <p className="text-2xl font-bold">{mockUsers.length}</p>
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
                  {mockUsers.filter(u => u.status === "active").length}
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
                  {mockUsers.filter(u => u.status === "pending").length}
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
                  {mockUsers.filter(u => u.role === "Cashier").length}
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
              <Button className="gap-2 bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
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
            Showing {filteredUsers.length} of {mockUsers.length} users
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
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
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