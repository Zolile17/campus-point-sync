import { useMemo } from "react";
import { mockTransactions } from "@/data/mockTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { TrendingUp, Package, Clock, CreditCard } from "lucide-react";

const COLORS = ['hsl(6 78% 57%)', 'hsl(142 76% 45%)', 'hsl(217 91% 60%)', 'hsl(38 92% 50%)', 'hsl(280 87% 65%)'];

const Metrics = () => {
  const analytics = useMemo(() => {
    // Most popular items
    const itemCounts: Record<string, { name: string; count: number; revenue: number }> = {};
    mockTransactions.forEach(t => {
      if (t.paymentStatus === "approved") {
        t.cartItems.forEach(item => {
          if (!itemCounts[item.name]) {
            itemCounts[item.name] = { name: item.name, count: 0, revenue: 0 };
          }
          itemCounts[item.name].count += item.quantity;
          itemCounts[item.name].revenue += item.quantity * item.price;
        });
      }
    });
    
    const topItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

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
      revenueByLocation,
      paymentData,
      peakHours,
      revenueTrend,
      terminalPerformance
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Metrics & Analytics</h1>
        <p className="text-muted-foreground mt-1">Deep dive into operational and revenue metrics</p>
      </div>

      {/* Top Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Most Popular Items
          </CardTitle>
          <CardDescription>Top selling items by quantity ordered</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Bar dataKey="count" fill="hsl(6 78% 57%)" name="Quantity" />
              <Bar dataKey="revenue" fill="hsl(142 76% 45%)" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue by Campus
            </CardTitle>
            <CardDescription>Total revenue breakdown per location</CardDescription>
          </CardHeader>
          <CardContent>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method Distribution
            </CardTitle>
            <CardDescription>Approved transactions by payment type</CardDescription>
          </CardHeader>
          <CardContent>
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
      </div>

      {/* Operational Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Peak Hours Analysis
          </CardTitle>
          <CardDescription>Transaction volume by hour of day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.peakHours}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => [`${value} transactions`, 'Volume']}
              />
              <Line type="monotone" dataKey="transactions" stroke="hsl(6 78% 57%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Daily Revenue Trend
          </CardTitle>
          <CardDescription>Revenue performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => [`R${value.toFixed(2)}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(142 76% 45%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Terminal Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Terminal Performance</CardTitle>
          <CardDescription>Transaction volume and revenue by terminal</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Bar yAxisId="left" dataKey="transactions" fill="hsl(6 78% 57%)" name="Transactions" />
              <Bar yAxisId="right" dataKey="revenue" fill="hsl(142 76% 45%)" name="Revenue (R)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Metrics;
