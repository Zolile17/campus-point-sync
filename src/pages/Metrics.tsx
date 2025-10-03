import { useMemo, useState } from "react";
import { mockTransactions } from "@/data/mockTransactions";
import { ItemCategory } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Package, Clock, CreditCard, Coffee, UtensilsCrossed, Plus, Activity, Banknote, ShoppingCart, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ['hsl(354 70% 54%)', 'hsl(142 76% 45%)', 'hsl(217 91% 60%)', 'hsl(38 92% 50%)', 'hsl(280 87% 65%)'];

type SortField = 'name' | 'quantity' | 'revenue' | 'avgPrice';
type SortOrder = 'asc' | 'desc';

const Metrics = () => {
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "all">("all");
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const analytics = useMemo(() => {
    // Detailed item breakdown for table
    const itemDetails: Record<string, { 
      name: string; 
      category: ItemCategory;
      quantity: number;
      revenue: number;
      avgPrice: number;
      transactions: number;
    }> = {};
    
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        t.cartItems.forEach(item => {
          if (!itemDetails[item.name]) {
            itemDetails[item.name] = { 
              name: item.name, 
              category: item.category,
              quantity: 0, 
              revenue: 0,
              avgPrice: item.price,
              transactions: 0
            };
          }
          itemDetails[item.name].quantity += item.quantity;
          itemDetails[item.name].revenue += item.quantity * item.price;
          itemDetails[item.name].transactions += 1;
        });
      }
    });
    
    let allItemsArray = Object.values(itemDetails);
    const totalRevenue = allItemsArray.reduce((sum, item) => sum + item.revenue, 0);
    
    // Add percentage and sort
    const itemsWithPercentage = allItemsArray.map(item => ({
      ...item,
      revenuePercent: (item.revenue / totalRevenue) * 100
    }));

    // Sort the items
    const sortedItems = [...itemsWithPercentage].sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name':
          return multiplier * a.name.localeCompare(b.name);
        case 'quantity':
          return multiplier * (a.quantity - b.quantity);
        case 'revenue':
          return multiplier * (a.revenue - b.revenue);
        case 'avgPrice':
          return multiplier * (a.avgPrice - b.avgPrice);
        default:
          return 0;
      }
    });

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
      sortedItems,
      topItems,
      categoryRevenue,
      revenueByLocation,
      paymentData,
      peakHours,
      revenueTrend,
      terminalPerformance,
      totalRevenue
    };
  }, [categoryFilter, sortField, sortOrder]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "All Day Menu": return <UtensilsCrossed className="h-4 w-4" />;
      case "Beverages": return <Coffee className="h-4 w-4" />;
      case "Add-ons": return <Plus className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "All Day Menu": return "bg-orange-100 text-orange-700 border-orange-300";
      case "Beverages": return "bg-blue-100 text-blue-700 border-blue-300";
      case "Add-ons": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
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
        <TabsList className="grid w-full grid-cols-3 p-1 bg-gradient-to-r from-red-600/10 via-red-500/10 to-black/10 border border-red-600/20">
          <TabsTrigger 
            value="revenue" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-black data-[state=active]:text-white transition-all"
          >
            <Banknote className="h-4 w-4" />
            Revenue & Financial
          </TabsTrigger>
          <TabsTrigger 
            value="transactions" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-black data-[state=active]:text-white transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
            Transaction & Volume
          </TabsTrigger>
          <TabsTrigger 
            value="products" 
            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600 data-[state=active]:to-black data-[state=active]:text-white transition-all"
          >
            <Package className="h-4 w-4" />
            Product Details
          </TabsTrigger>
        </TabsList>

        {/* Product Details Tab */}
        <TabsContent value="products" className="space-y-6">
          {/* Summary Cards at Top */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
                </div>
                <p className="text-3xl font-bold text-blue-700">{analytics.sortedItems.length}</p>
                <p className="text-xs text-muted-foreground mt-1">on the menu</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {analytics.sortedItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">total quantity sold</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Banknote className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-red-700">
                  R{analytics.totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">from all products</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">Best Seller</p>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {analytics.sortedItems.sort((a, b) => b.quantity - a.quantity)[0]?.name.slice(0, 15)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics.sortedItems.sort((a, b) => b.quantity - a.quantity)[0]?.quantity} sold
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Best Sellers by Category */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b border-red-600/10">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Best Sellers by Category
              </CardTitle>
              <CardDescription>Top performing item in each category</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* All Day Menu Best Seller */}
                {(() => {
                  const menuItems = analytics.sortedItems.filter(item => item.category === "All Day Menu");
                  const bestSeller = menuItems.sort((a, b) => b.quantity - a.quantity)[0];
                  return bestSeller ? (
                    <div className="p-4 rounded-lg border bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
                      <div className="flex items-center gap-2 mb-3">
                        <UtensilsCrossed className="h-5 w-5 text-orange-600" />
                        <h4 className="font-semibold text-sm text-orange-900">All Day Menu</h4>
                      </div>
                      <p className="text-xl font-bold text-orange-700 mb-1">{bestSeller.name}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{bestSeller.quantity} sold</span>
                        <span className="font-semibold text-green-600">R{bestSeller.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Beverages Best Seller */}
                {(() => {
                  const beverageItems = analytics.sortedItems.filter(item => item.category === "Beverages");
                  const bestSeller = beverageItems.sort((a, b) => b.quantity - a.quantity)[0];
                  return bestSeller ? (
                    <div className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Coffee className="h-5 w-5 text-blue-600" />
                        <h4 className="font-semibold text-sm text-blue-900">Beverages</h4>
                      </div>
                      <p className="text-xl font-bold text-blue-700 mb-1">{bestSeller.name}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{bestSeller.quantity} sold</span>
                        <span className="font-semibold text-green-600">R{bestSeller.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : null;
                })()}

                {/* Add-ons Best Seller */}
                {(() => {
                  const addonItems = analytics.sortedItems.filter(item => item.category === "Add-ons");
                  const bestSeller = addonItems.sort((a, b) => b.quantity - a.quantity)[0];
                  return bestSeller ? (
                    <div className="p-4 rounded-lg border bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Plus className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-sm text-green-900">Add-ons</h4>
                      </div>
                      <p className="text-xl font-bold text-green-700 mb-1">{bestSeller.name}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{bestSeller.quantity} sold</span>
                        <span className="font-semibold text-green-600">R{bestSeller.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-600/5 via-red-500/5 to-black/5 border-b border-red-600/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Detailed Product Performance
              </CardTitle>
              <CardDescription>Complete breakdown of all products for inventory planning</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-3 font-bold">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('name')}
                          className="h-8 px-2 hover:bg-transparent flex items-center"
                        >
                          Product Name
                          {getSortIcon('name')}
                        </Button>
                      </th>
                      <th className="text-left p-3 font-bold">Category</th>
                      <th className="text-right p-3 font-bold">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('quantity')}
                          className="h-8 px-2 hover:bg-transparent ml-auto flex items-center"
                        >
                          Units Sold
                          {getSortIcon('quantity')}
                        </Button>
                      </th>
                      <th className="text-right p-3 font-bold">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('revenue')}
                          className="h-8 px-2 hover:bg-transparent ml-auto flex items-center"
                        >
                          Total Revenue
                          {getSortIcon('revenue')}
                        </Button>
                      </th>
                      <th className="text-right p-3 font-bold">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleSort('avgPrice')}
                          className="h-8 px-2 hover:bg-transparent ml-auto flex items-center"
                        >
                          Avg Price
                          {getSortIcon('avgPrice')}
                        </Button>
                      </th>
                      <th className="text-right p-3 font-bold">% of Revenue</th>
                      <th className="text-right p-3 font-bold">Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.sortedItems.map((item) => (
                      <tr key={item.name} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(item.category)}`}>
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 text-right font-semibold">{item.quantity}</td>
                        <td className="p-3 text-right font-semibold text-green-600">
                          R{item.revenue.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">R{item.avgPrice.toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
                                style={{ width: `${Math.min(item.revenuePercent, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">
                              {item.revenuePercent.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right text-muted-foreground">{item.transactions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600/5 to-black/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Daily Revenue Trend
              </CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    formatter={(value: number) => [`R${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(142 76% 45%)" strokeWidth={3} dot={{ fill: 'hsl(142 76% 45%)', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
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
              {/* Peak Time Stat Card */}
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200">
                <p className="text-sm text-muted-foreground mb-1">Busiest Time</p>
                <p className="text-3xl font-bold text-orange-700">
                  {(() => {
                    const peakHour = analytics.peakHours.reduce((max, hour) => 
                      hour.transactions > max.transactions ? hour : max
                    );
                    return peakHour.hour;
                  })()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {(() => {
                    const peakHour = analytics.peakHours.reduce((max, hour) => 
                      hour.transactions > max.transactions ? hour : max
                    );
                    return `${peakHour.transactions} transactions`;
                  })()}
                </p>
              </div>
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
              <CardDescription>Top selling items by quantity</CardDescription>
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
                    formatter={(value: number) => [`${value} sold`, 'Quantity']}
                  />
                  <Bar dataKey="count" fill="hsl(354 70% 54%)" name="Quantity Sold" radius={[4, 4, 0, 0]} />
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