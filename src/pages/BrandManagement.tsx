import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Users, Activity, Plus, Settings } from "lucide-react";

const campuses = [
  {
    id: "1",
    name: "Cape Town",
    fullName: "Capsicum-CCS Cape Town",
    address: "123 Main Road, Cape Town, 8001",
    terminal: "TERM-001",
    activeUsers: 3,
    status: "active",
    totalTransactions: 8,
    revenue: 1234.50,
  },
  {
    id: "2",
    name: "Durban",
    fullName: "Capsicum-CCS Durban",
    address: "456 Beach Front, Durban, 4001",
    terminal: "TERM-002",
    activeUsers: 3,
    status: "active",
    totalTransactions: 9,
    revenue: 1456.25,
  },
  {
    id: "3",
    name: "Nelson Mandela Bay",
    fullName: "Capsicum-CCS Nelson Mandela Bay",
    address: "789 University Avenue, Gqeberha, 6001",
    terminal: "TERM-003",
    activeUsers: 2,
    status: "active",
    totalTransactions: 5,
    revenue: 876.75,
  },
  {
    id: "4",
    name: "Pretoria",
    fullName: "Capsicum-CCS Pretoria",
    address: "321 Campus Drive, Pretoria, 0001",
    terminal: "TERM-004",
    activeUsers: 2,
    status: "active",
    totalTransactions: 8,
    revenue: 1284.00,
  },
];

const BrandManagement = () => {
  const totalCampuses = campuses.length;
  const totalUsers = campuses.reduce((sum, campus) => sum + campus.activeUsers, 0);
  const totalRevenue = campuses.reduce((sum, campus) => sum + campus.revenue, 0);
  const totalTransactions = campuses.reduce((sum, campus) => sum + campus.totalTransactions, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-black bg-clip-text text-transparent">
            Brand Management
          </h1>
          <p className="text-muted-foreground mt-1">Manage campus locations and terminals</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900">
          <Plus className="h-4 w-4" />
          Add Campus
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Campuses</p>
                <p className="text-2xl font-bold">{totalCampuses}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">R{totalRevenue.toFixed(2)}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campus Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campuses.map((campus) => (
          <Card key={campus.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-red-600/10 to-black/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{campus.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {campus.address}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="default" className="gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  {campus.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Terminal Info */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Terminal ID</span>
                  <span className="font-mono font-semibold">{campus.terminal}</span>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-2xl font-bold text-blue-600">{campus.activeUsers}</p>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <Activity className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">{campus.totalTransactions}</p>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Building2 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <p className="text-lg font-bold text-purple-600">R{campus.revenue.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Settings className="h-4 w-4" />
                    Configure
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Users className="h-4 w-4" />
                    View Users
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Campus Network Overview</CardTitle>
          <CardDescription>All Capsicum Culinary Studio locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campuses.map((campus) => (
              <div key={campus.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-black flex items-center justify-center text-white font-bold">
                    {campus.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{campus.fullName}</p>
                    <p className="text-sm text-muted-foreground">{campus.terminal}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Users</p>
                    <p className="font-semibold">{campus.activeUsers}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-semibold">R{campus.revenue.toFixed(2)}</p>
                  </div>
                  <Badge variant={campus.status === "active" ? "default" : "secondary"}>
                    {campus.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandManagement;