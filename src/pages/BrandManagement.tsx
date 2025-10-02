import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Building2, MapPin, Users, Activity, Plus, Settings } from "lucide-react";

const campusesInitial = [
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
  const [campuses, setCampuses] = useState(campusesInitial);
  const [isAddCampusOpen, setIsAddCampusOpen] = useState(false);
  const [newCampus, setNewCampus] = useState({
    name: "",
    address: "",
    terminal: ""
  });

  const handleAddCampus = () => {
    // Create new campus object
    const campusToAdd = {
      id: String(campuses.length + 1),
      name: newCampus.name,
      fullName: `Capsicum-CCS ${newCampus.name}`,
      address: newCampus.address,
      terminal: newCampus.terminal,
      activeUsers: 0,
      status: "active",
      totalTransactions: 0,
      revenue: 0,
    };
    
    // Add to campuses array
    setCampuses([...campuses, campusToAdd]);
    
    alert(`✅ Campus Added Successfully!\n\nCampus: Capsicum-CCS ${newCampus.name}\nAddress: ${newCampus.address}\nTerminal: ${newCampus.terminal}\n\nStatus: Active\n\nThe new campus is now operational and ready for user assignments.`);
    setIsAddCampusOpen(false);
    
    // Reset form
    setNewCampus({
      name: "",
      address: "",
      terminal: ""
    });
  };
  
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
        
        <Dialog open={isAddCampusOpen} onOpenChange={setIsAddCampusOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900">
              <Plus className="h-4 w-4" />
              Add Campus
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Campus</DialogTitle>
              <DialogDescription>
                Register a new Capsicum Culinary Studio location with terminal assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="campus-name">Campus Name</Label>
                <Input
                  id="campus-name"
                  placeholder="e.g., Johannesburg"
                  value={newCampus.name}
                  onChange={(e) => setNewCampus({...newCampus, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., 123 Main Street, Johannesburg, 2000"
                  value={newCampus.address}
                  onChange={(e) => setNewCampus({...newCampus, address: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="terminal">Terminal ID</Label>
                <Input
                  id="terminal"
                  placeholder="e.g., TERM-005"
                  value={newCampus.terminal}
                  onChange={(e) => setNewCampus({...newCampus, terminal: e.target.value.toUpperCase()})}
                />
                <p className="text-xs text-muted-foreground">
                  Terminal ID must be unique (e.g., TERM-005)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCampusOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddCampus}
                disabled={!newCampus.name || !newCampus.address || !newCampus.terminal}
                className="bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900"
              >
                Add Campus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
    </div>
  );
};

export default BrandManagement;