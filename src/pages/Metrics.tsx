import { useMemo, useState } from "react";
import { mockTransactions } from "@/data/mockTransactions";
import { ItemCategory } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Package, Clock, CreditCard, Coffee, UtensilsCrossed, Plus, Activity, DollarSign, ShoppingCart } from "lucide-react";

const COLORS = ['hsl(354 70% 54%)', 'hsl(142 76% 45%)', 'hsl(217 91% 60%)', 'hsl(38 92% 50%)', 'hsl(280 87% 65%)'];

const Metrics = () => {
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "all">("all");

  const analytics = useMemo(() => {
    // Most popular items by category
    const itemCounts: Record<string, { name: string; count: number; revenue: number; category: ItemCategory }> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        t.cartItems.forEach(item => {
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { name: item.name, count: 0, revenue: 0, category: item.category };
          }
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += item.quantity * item.price;
        });
      }
    });
    
    const allItems = Object.values(itemCounts).sort((a, b) => b.count - a.count);
    
    const topItems = categoryFilter === "all" 
      ? allItems.slice(0, 10)
      : allItems.filter(item => item.category === categoryFilter).slice(0, 10);
    
    // Category breakdown
    const categoryStats: Record<ItemCategory, { count: number; revenue: number }> = {
      "All Day Menu": { count: 0, revenue: 0 },
      "Beverages": { count: 0, revenue: 0 },
      "Add-ons": { count: 0, revenue: 0 },
    };
    
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        t.cartItems.forEach(item => {
          categoryStats[item.category].count += item.quantity;
          categoryStats[item.category].revenue += item.quantity * item.price;
        });
      }
    });
    
    const categoryRevenue = Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      revenue: parseFloat(stats.revenue.toFixed(2)),
      count: stats.count
    }));

    // Revenue by campus
    const campusRevenue: Record<string, number> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        campusRevenue[t.campus] = (campusRevenue[t.campus] || 0) + t.total;
      }
    });
    
    const revenueByLocation = Object.entries(campusRevenue).map(([name, value]) => ({
      name: name.replace('Capsicum-CCS ', ''),
      value: parseFloat(value.toFixed(2))
    }));

    // Payment method distribution
    const paymentMethods: Record<string, number> = { debit: 0, credit: 0 };
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        paymentMethods[t.paymentMethod]++;
      }
    });
    
    const paymentData = Object.entries(paymentMethods).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));

    // Peak hours analysis
    const hourlyTransactions: Record<number, number> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        const hour = t.timestamp.getHours();
        hourlyTransactions[hour] = (hourlyTransactions[hour] || 0) + 1;
      }
    });
    
    const peakHours = Object.entries(hourlyTransactions)
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        transactions: count
      }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

    // Daily revenue trend
    const dailyRevenue: Record<string, number> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        const date = t.timestamp.toISOString().split('T')[0];
        dailyRevenue[date] = (dailyRevenue[date] || 0) + t.total;
      }
    });
    
    const revenueTrend = Object.entries(dailyRevenue)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' }),
        revenue: parseFloat(revenue.toFixed(2))
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Terminal performance
    const terminalStats: Record<string, { transactions: number; revenue: number }> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        if (!terminalStats[t.terminalId]) {
          terminalStats[t.terminalId] = { transactions: 0, revenue: 0 };
        }
        terminalStats[t.terminalId].transactions++;
        terminalStats[t.terminalId].revenue += t.total;
      }
    });
    
    const terminalPerformance = Object.entries(terminalStats).map(([terminal, stats]) => ({
      terminal,
      transactions: stats.transactions,
      revenue: parseFloat(stats.revenue.toFixed(2))
    }));

    return {
      topItems,
      categoryRevenue,
      revenueByLocation,
      paymentData,
      peakHours,
      revenueTrend,
      terminalPerformance
    };
  }, [categoryFilter]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "All Day Menu": return <UtensilsCrossed className="h-4 w-4" />;
      case "Beverages": return <Coffee className="h-4 w-4" />;
      case "Add-ons": return <Plus className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-black bg-clip-text text-transparent">
          Metrics & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Deep dive into operational and revenue metrics</p>
      </div>

      {/* Tabbed Navigation */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-gradient-to-r from-red-600/10 via-red-500/10 to-black/10 border border-red-600/20">
          <TabsTrigger 
            value="revenue" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-black data-[state=active]:text-white transition-all"
          >
           
            Revenue & Financial
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-black data-[state=active]:text-white transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            Transaction & Volume
          </TabsTrigger>
        </TabsList>

        {/* Revenue & Financial Tab */}
        <TabsContent value="revenue" className="space-y-6">
          {/* Category Revenue Overview - MOVED TO TOP */}
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b border-red-600/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Revenue by Category
              </CardTitle>
              <CardDescription>Performance across All Day Menu, Beverages, and Add-ons</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {analytics.categoryRevenue.map((cat, idx) => (
                  <div key={cat.name} className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(cat.name)}
                      <h4 className="font-semibold text-sm">{cat.name}</h4>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                      R{cat.revenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{cat.count} items sold</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, revenue }) => `${name}: R${revenue}`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="revenue"
                  >
                    {analytics.categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campus Revenue Comparison */}
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b border-red-600/10">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Campus Performance Analysis
              </CardTitle>
              <CardDescription>Revenue distribution across different campuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {(() => {
                const campusRevenue: Record<string, number> = {};
                mockTransactions.forEach(t => {
                  if (t.paymentStatus === "approved") {
                    campusRevenue[t.campus] = (campusRevenue[t.campus] || 0) + t.total;
                  }
                });
                const totalRevenue = Object.values(campusRevenue).reduce((sum, val) => sum + val, 0);
                const campusData = Object.entries(campusRevenue)
                  .map(([name, value]) => ({
                    name: name.replace('Capsicum-CCS ', ''),
                    revenue: value,
                    percentage: ((value / totalRevenue) * 100).toFixed(1)
                  }))
                  .sort((a, b) => b.revenue - a.revenue);
                
                const maxRevenue = Math.max(...campusData.map(c => c.revenue));
                
                return (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-red-600/10 to-black/10 border border-red-600/20">
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                        R{totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      {campusData.map((campus, idx) => (
                        <div key={campus.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              <span className="font-medium">{campus.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">R{campus.revenue.toFixed(2)}</span>
                              <span className="text-sm text-muted-foreground ml-2">({campus.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all" 
                              style={{ 
                                width: `${(campus.revenue / maxRevenue) * 100}%`,
                                backgroundColor: COLORS[idx % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Revenue by Campus & Daily Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Revenue Distribution
                </CardTitle>
                <CardDescription>Revenue breakdown per location</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.revenueByLocation}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: R${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.revenueByLocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Daily Revenue Trend
                </CardTitle>
                <CardDescription>Revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number) => [`R${value.toFixed(2)}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(142 76% 45%)" strokeWidth={2} dot={{ fill: 'hsl(142 76% 45%)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transaction & Volume Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Category Transaction Overview - NEW */}
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b border-red-600/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Transaction Volume by Category
              </CardTitle>
              <CardDescription>Performance across All Day Menu, Beverages, and Add-ons</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {analytics.categoryRevenue.map((cat, idx) => (
                  <div key={cat.name} className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(cat.name)}
                      <h4 className="font-semibold text-sm">{cat.name}</h4>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                      {cat.count}
                    </p>
                    <p className="text-xs text-muted-foreground">items sold</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryRevenue}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.categoryRevenue.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campus Transaction Comparison */}
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b border-red-600/10">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Campus Performance Analysis
              </CardTitle>
              <CardDescription>Transaction volume distribution across different campuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {(() => {
                const campusTransactions: Record<string, number> = {};
                mockTransactions.forEach(t => {
                  if (t.paymentStatus === "approved") {
                    campusTransactions[t.campus] = (campusTransactions[t.campus] || 0) + 1;
                  }
                });
                const totalTransactions = Object.values(campusTransactions).reduce((sum, val) => sum + val, 0);
                const campusData = Object.entries(campusTransactions)
                  .map(([name, value]) => ({
                    name: name.replace('Capsicum-CCS ', ''),
                    transactions: value,
                    percentage: ((value / totalTransactions) * 100).toFixed(1)
                  }))
                  .sort((a, b) => b.transactions - a.transactions);
                
                const maxTransactions = Math.max(...campusData.map(c => c.transactions));
                
                return (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                      <p className="text-3xl font-bold text-green-600">{totalTransactions}</p>
                    </div>
                    
                    <div className="space-y-4">
                      {campusData.map((campus, idx) => (
                        <div key={campus.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                              <span className="font-medium">{campus.name}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">{campus.transactions}</span>
                              <span className="text-sm text-muted-foreground ml-2">({campus.percentage}%)</span>
                            </div>
                          </div>
                          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all" 
                              style={{ 
                                width: `${(campus.transactions / maxTransactions) * 100}%`,
                                backgroundColor: COLORS[idx % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Peak Hours Analysis */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Peak Hours Analysis
              </CardTitle>
              <CardDescription>Transaction volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`${value} transactions`, 'Volume']}
                  />
                  <Line type="monotone" dataKey="transactions" stroke="hsl(354 70% 54%)" strokeWidth={2} dot={{ fill: 'hsl(354 70% 54%)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Items with Category Filter */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Most Popular Items
              </CardTitle>
              <CardDescription>Top selling items by quantity ordered</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ItemCategory | "all")} className="mb-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Categories</TabsTrigger>
                  <TabsTrigger value="All Day Menu" className="flex items-center gap-1">
                    <UtensilsCrossed className="h-3 w-3" /> Menu
                  </TabsTrigger>
                  <TabsTrigger value="Beverages" className="flex items-center gap-1">
                    <Coffee className="h-3 w-3" /> Beverages
                  </TabsTrigger>
                  <TabsTrigger value="Add-ons" className="flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add-ons
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analytics.topItems}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} className="text-xs" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number, name: string) => [
                      name === 'count' ? `${value} sold` : `R${value.toFixed(2)}`,
                      name === 'count' ? 'Quantity' : 'Revenue'
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="count" fill="hsl(354 70% 54%)" name="Quantity" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="hsl(142 76% 45%)" name="Revenue" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Method & Terminal Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method Distribution
                </CardTitle>
                <CardDescription>Approved transactions by payment type</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.paymentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.paymentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
                <CardTitle>Terminal Performance</CardTitle>
                <CardDescription>Transaction volume and revenue by terminal</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.terminalPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="terminal" />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(6 78% 57%)" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(142 76% 45%)" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      formatter={(value: number, name: string) => [
                        name === 'transactions' ? value : `R${value.toFixed(2)}`,
                        name === 'transactions' ? 'Transactions' : 'Revenue'
                      ]}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="transactions" fill="hsl(354 70% 54%)" name="Transactions" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="revenue" fill="hsl(142 76% 45%)" name="Revenue (R)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Metrics;