import { useMemo, useState } from "react";
import { mockTransactions } from "@/data/mockTransactions";
import { ItemCategory } from "@/types/transaction";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Package, Clock, CreditCard, Coffee, UtensilsCrossed, Plus, Activity, Banknote, ShoppingCart, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const COLORS = ['hsl(152 60% 36%)', 'hsl(142 76% 45%)', 'hsl(217 91% 60%)', 'hsl(38 92% 50%)', 'hsl(280 87% 65%)'];

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
    const itemDetails: Record<string, { 
      name: string; category: ItemCategory; quantity: number; revenue: number; avgPrice: number; transactions: number;
    }> = {};
    
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        t.cartItems.forEach(item => {
          if (!itemDetails[item.name]) {
            itemDetails[item.name] = { name: item.name, category: item.category, quantity: 0, revenue: 0, avgPrice: item.price, transactions: 0 };
          }
          itemDetails[item.name].quantity += item.quantity;
          itemDetails[item.name].revenue += item.quantity * item.price;
          itemDetails[item.name].transactions += 1;
        });
      }
    });
    
    const allItemsArray = Object.values(itemDetails);
    const totalRevenue = allItemsArray.reduce((sum, item) => sum + item.revenue, 0);
    
    const itemsWithPercentage = allItemsArray.map(item => ({
      ...item, revenuePercent: (item.revenue / totalRevenue) * 100
    }));

    const sortedItems = [...itemsWithPercentage].sort((a, b) => {
      const m = sortOrder === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'name': return m * a.name.localeCompare(b.name);
        case 'quantity': return m * (a.quantity - b.quantity);
        case 'revenue': return m * (a.revenue - b.revenue);
        case 'avgPrice': return m * (a.avgPrice - b.avgPrice);
        default: return 0;
      }
    });

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
      name, revenue: parseFloat(stats.revenue.toFixed(2)), count: stats.count
    }));

    const campusRevenue: Record<string, number> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        campusRevenue[t.campus] = (campusRevenue[t.campus] || 0) + t.total;
      }
    });
    const revenueByLocation = Object.entries(campusRevenue).map(([name, value]) => ({
      name: name.replace('Intellergy Cafe ', ''), value: parseFloat(value.toFixed(2))
    }));

    const paymentMethods: Record<string, number> = { debit: 0, credit: 0 };
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") paymentMethods[t.paymentMethod]++;
    });
    const paymentData = Object.entries(paymentMethods).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1), value
    }));

    const hourlyTransactions: Record<number, number> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        const hour = t.timestamp.getHours();
        hourlyTransactions[hour] = (hourlyTransactions[hour] || 0) + 1;
      }
    });
    const peakHours = Object.entries(hourlyTransactions)
      .map(([hour, count]) => ({ hour: `${hour}:00`, transactions: count }))
      .sort((a, b) => parseInt(a.hour) - parseInt(b.hour));

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

    const terminalStats: Record<string, { transactions: number; revenue: number }> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        if (!terminalStats[t.terminalId]) terminalStats[t.terminalId] = { transactions: 0, revenue: 0 };
        terminalStats[t.terminalId].transactions++;
        terminalStats[t.terminalId].revenue += t.total;
      }
    });
    const terminalPerformance = Object.entries(terminalStats).map(([terminal, stats]) => ({
      terminal, transactions: stats.transactions, revenue: parseFloat(stats.revenue.toFixed(2))
    }));

    return { sortedItems, topItems, categoryRevenue, revenueByLocation, paymentData, peakHours, revenueTrend, terminalPerformance, totalRevenue };
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
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-800 bg-clip-text text-transparent">
          Metrics & Analytics
        </h1>
        <p className="text-muted-foreground mt-1">Deep dive into operational and revenue metrics</p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 p-1 bg-gradient-to-r from-green-600/10 via-green-500/10 to-green-800/10 border border-green-600/20">
          <TabsTrigger value="revenue" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-green-900 data-[state=active]:text-white transition-all">
            <Banknote className="h-4 w-4" /> Revenue & Financial
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-green-900 data-[state=active]:text-white transition-all">
            <ShoppingCart className="h-4 w-4" /> Transaction & Volume
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-700 data-[state=active]:to-green-900 data-[state=active]:text-white transition-all">
            <Package className="h-4 w-4" /> Product Details
          </TabsTrigger>
        </TabsList>

        {/* Product Details Tab */}
        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-600 rounded-lg"><Package className="h-5 w-5 text-white" /></div>
                  <p className="text-sm font-medium text-muted-foreground">Menu Items</p>
                </div>
                <p className="text-3xl font-bold text-green-700">{analytics.sortedItems.length}</p>
                <p className="text-xs text-muted-foreground mt-1">on the menu</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-600 rounded-lg"><ShoppingCart className="h-5 w-5 text-white" /></div>
                  <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
                </div>
                <p className="text-3xl font-bold text-emerald-700">{analytics.sortedItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                <p className="text-xs text-muted-foreground mt-1">total quantity sold</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-teal-600 rounded-lg"><Banknote className="h-5 w-5 text-white" /></div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                </div>
                <p className="text-3xl font-bold text-teal-700">R{analytics.totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">from all products</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-lime-50 to-lime-100/50 border-lime-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-lime-600 rounded-lg"><TrendingUp className="h-5 w-5 text-white" /></div>
                  <p className="text-sm font-medium text-muted-foreground">Best Seller</p>
                </div>
                <p className="text-2xl font-bold text-lime-700">
                  {[...analytics.sortedItems].sort((a, b) => b.quantity - a.quantity)[0]?.name.slice(0, 15)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {[...analytics.sortedItems].sort((a, b) => b.quantity - a.quantity)[0]?.quantity} sold
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Best Sellers by Category */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600/5 via-green-500/5 to-green-800/5 border-b border-green-600/10">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Best Sellers by Category
              </CardTitle>
              <CardDescription>Top performing item in each category</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(["All Day Menu", "Beverages", "Add-ons"] as ItemCategory[]).map(cat => {
                  const items = [...analytics.sortedItems].filter(i => i.category === cat).sort((a, b) => b.quantity - a.quantity);
                  const best = items[0];
                  const colors = cat === "All Day Menu" ? { bg: "from-orange-50 to-orange-100/50", border: "border-orange-200", text: "text-orange-700", title: "text-orange-900", icon: "text-orange-600" }
                    : cat === "Beverages" ? { bg: "from-blue-50 to-blue-100/50", border: "border-blue-200", text: "text-blue-700", title: "text-blue-900", icon: "text-blue-600" }
                    : { bg: "from-green-50 to-green-100/50", border: "border-green-200", text: "text-green-700", title: "text-green-900", icon: "text-green-600" };
                  return best ? (
                    <div key={cat} className={`p-4 rounded-lg border bg-gradient-to-br ${colors.bg} ${colors.border}`}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={colors.icon}>{getCategoryIcon(cat)}</span>
                        <h4 className={`font-semibold text-sm ${colors.title}`}>{cat}</h4>
                      </div>
                      <p className={`text-xl font-bold ${colors.text} mb-1`}>{best.name}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{best.quantity} sold</span>
                        <span className="font-semibold text-green-600">R{best.revenue.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Product Table */}
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600/5 via-green-500/5 to-green-800/5 border-b border-green-600/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Detailed Product Performance
              </CardTitle>
              <CardDescription>Complete breakdown of all products for inventory planning</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="rounded-md border overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-3 font-bold">
                        <Button variant="ghost" onClick={() => handleSort('name')} className="h-8 px-2 hover:bg-transparent flex items-center">
                          Product Name {getSortIcon('name')}
                        </Button>
                      </th>
                      <th className="text-left p-3 font-bold">Category</th>
                      <th className="text-right p-3 font-bold">
                        <Button variant="ghost" onClick={() => handleSort('quantity')} className="h-8 px-2 hover:bg-transparent ml-auto flex items-center">
                          Units Sold {getSortIcon('quantity')}
                        </Button>
                      </th>
                      <th className="text-right p-3 font-bold">
                        <Button variant="ghost" onClick={() => handleSort('revenue')} className="h-8 px-2 hover:bg-transparent ml-auto flex items-center">
                          Total Revenue {getSortIcon('revenue')}
                        </Button>
                      </th>
                      <th className="text-right p-3 font-bold">
                        <Button variant="ghost" onClick={() => handleSort('avgPrice')} className="h-8 px-2 hover:bg-transparent ml-auto flex items-center">
                          Avg Price {getSortIcon('avgPrice')}
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
                            {getCategoryIcon(item.category)} {item.category}
                          </span>
                        </td>
                        <td className="p-3 text-right font-semibold">{item.quantity}</td>
                        <td className="p-3 text-right font-semibold text-green-600">R{item.revenue.toFixed(2)}</td>
                        <td className="p-3 text-right">R{item.avgPrice.toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full" style={{ width: `${Math.min(item.revenuePercent, 100)}%` }} />
                            </div>
                            <span className="text-xs font-medium w-12 text-right">{item.revenuePercent.toFixed(1)}%</span>
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
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600/5 via-green-500/5 to-green-800/5 border-b border-green-600/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Revenue by Category
              </CardTitle>
              <CardDescription>Performance across All Day Menu, Beverages, and Add-ons</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {analytics.categoryRevenue.map((cat) => (
                  <div key={cat.name} className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(cat.name)}
                      <h4 className="font-semibold text-sm">{cat.name}</h4>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                      R{cat.revenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">{cat.count} items sold</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={analytics.categoryRevenue} cx="50%" cy="50%" labelLine={false} label={({ name, revenue }) => `${name}: R${revenue}`} outerRadius={110} fill="#8884d8" dataKey="revenue">
                    {analytics.categoryRevenue.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `R${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Campus Revenue */}
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600/5 via-green-500/5 to-green-800/5 border-b border-green-600/10">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Campus Performance Analysis
              </CardTitle>
              <CardDescription>Revenue distribution across different campuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {(() => {
                const campusRev: Record<string, number> = {};
                mockTransactions.forEach(t => {
                  if (t.paymentStatus === "approved") campusRev[t.campus] = (campusRev[t.campus] || 0) + t.total;
                });
                const total = Object.values(campusRev).reduce((s, v) => s + v, 0);
                const data = Object.entries(campusRev).map(([name, value]) => ({
                  name: name.replace('Intellergy Cafe ', ''), revenue: value, percentage: ((value / total) * 100).toFixed(1)
                })).sort((a, b) => b.revenue - a.revenue);
                const max = Math.max(...data.map(c => c.revenue));
                return (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">R{total.toFixed(2)}</p>
                    </div>
                    <div className="space-y-4">
                      {data.map((campus, idx) => (
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
                            <div className="h-full rounded-full transition-all" style={{ width: `${(campus.revenue / max) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Daily Revenue Trend */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600/5 to-green-800/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Daily Revenue Trend
              </CardTitle>
              <CardDescription>Revenue performance over time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => [`R${value.toFixed(2)}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(152 60% 36%)" strokeWidth={3} dot={{ fill: 'hsl(152 60% 36%)', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction & Volume Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-primary/20 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600/5 via-green-500/5 to-green-800/5 border-b border-green-600/10">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Transaction Volume by Category
              </CardTitle>
              <CardDescription>Performance across All Day Menu, Beverages, and Add-ons</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {analytics.categoryRevenue.map((cat) => (
                  <div key={cat.name} className="p-4 rounded-lg border bg-gradient-to-br from-card to-muted/20 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      {getCategoryIcon(cat.name)}
                      <h4 className="font-semibold text-sm">{cat.name}</h4>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">{cat.count}</p>
                    <p className="text-xs text-muted-foreground">items sold</p>
                  </div>
                ))}
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={analytics.categoryRevenue} cx="50%" cy="50%" labelLine={false} label={({ name, count }) => `${name}: ${count}`} outerRadius={110} fill="#8884d8" dataKey="count">
                    {analytics.categoryRevenue.map((_, index) => (
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
            <CardHeader className="bg-gradient-to-r from-green-600/5 via-green-500/5 to-green-800/5 border-b border-green-600/10">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Campus Performance Analysis
              </CardTitle>
              <CardDescription>Transaction volume distribution across different campuses</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {(() => {
                const campusTx: Record<string, number> = {};
                mockTransactions.forEach(t => {
                  if (t.paymentStatus === "approved") campusTx[t.campus] = (campusTx[t.campus] || 0) + 1;
                });
                const total = Object.values(campusTx).reduce((s, v) => s + v, 0);
                const data = Object.entries(campusTx).map(([name, value]) => ({
                  name: name.replace('Intellergy Cafe ', ''), transactions: value, percentage: ((value / total) * 100).toFixed(1)
                })).sort((a, b) => b.transactions - a.transactions);
                const max = Math.max(...data.map(c => c.transactions));
                return (
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                      <p className="text-sm text-muted-foreground mb-1">Total Transactions</p>
                      <p className="text-3xl font-bold text-green-600">{total}</p>
                    </div>
                    <div className="space-y-4">
                      {data.map((campus, idx) => (
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
                            <div className="h-full rounded-full transition-all" style={{ width: `${(campus.transactions / max) * 100}%`, backgroundColor: COLORS[idx % COLORS.length] }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600/5 to-green-800/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Peak Hours Analysis
              </CardTitle>
              <CardDescription>Transaction volume by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200">
                <p className="text-sm text-muted-foreground mb-1">Busiest Time</p>
                <p className="text-3xl font-bold text-green-700">
                  {analytics.peakHours.reduce((max, hour) => hour.transactions > max.transactions ? hour : max).hour}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {analytics.peakHours.reduce((max, hour) => hour.transactions > max.transactions ? hour : max).transactions} transactions
                </p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.peakHours}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => [`${value} transactions`, 'Volume']} />
                  <Line type="monotone" dataKey="transactions" stroke="hsl(152 60% 36%)" strokeWidth={2} dot={{ fill: 'hsl(152 60% 36%)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Most Popular Items */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-600/5 to-green-800/5 border-b">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Most Popular Items
              </CardTitle>
              <CardDescription>Top selling items by quantity</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as ItemCategory | "all")} className="mb-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Categories</TabsTrigger>
                  <TabsTrigger value="All Day Menu" className="flex items-center gap-1"><UtensilsCrossed className="h-3 w-3" /> Menu</TabsTrigger>
                  <TabsTrigger value="Beverages" className="flex items-center gap-1"><Coffee className="h-3 w-3" /> Beverages</TabsTrigger>
                  <TabsTrigger value="Add-ons" className="flex items-center gap-1"><Plus className="h-3 w-3" /> Add-ons</TabsTrigger>
                </TabsList>
              </Tabs>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={analytics.topItems}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} className="text-xs" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: number) => [`${value} sold`, 'Quantity']} />
                  <Bar dataKey="count" fill="hsl(152 60% 36%)" name="Quantity Sold" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payment Method & Terminal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600/5 to-green-800/5 border-b">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" /> Payment Method Distribution
                </CardTitle>
                <CardDescription>Approved transactions by payment type</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={analytics.paymentData} cx="50%" cy="50%" labelLine={false} label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`} outerRadius={100} fill="#8884d8" dataKey="value">
                      {analytics.paymentData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600/5 to-green-800/5 border-b">
                <CardTitle>Terminal Performance</CardTitle>
                <CardDescription>Transaction volume and revenue by terminal</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.terminalPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="terminal" />
                    <YAxis yAxisId="left" orientation="left" stroke="hsl(152 60% 36%)" />
                    <YAxis yAxisId="right" orientation="right" stroke="hsl(142 76% 45%)" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: number, name: string) => [name === 'transactions' ? value : `R${value.toFixed(2)}`, name === 'transactions' ? 'Transactions' : 'Revenue']} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="transactions" fill="hsl(152 60% 36%)" name="Transactions" radius={[4, 4, 0, 0]} />
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
