import { useState, useMemo } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionFilters } from "@/components/dashboard/TransactionFilters";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { Card } from "@/components/ui/card";
import { mockTransactions } from "@/data/mockTransactions";
import { exportToCSV } from "@/utils/csvExport";
import { DollarSign, TrendingUp, CreditCard, Activity } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [campusFilter, setCampusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const stats = useMemo(() => {
    const totalRevenue = mockTransactions
      .filter(t => t.paymentStatus === "approved")
      .reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = mockTransactions.length;
    const approvedTransactions = mockTransactions.filter(t => t.paymentStatus === "approved").length;
    const approvalRate = (approvedTransactions / totalTransactions) * 100;
    const averageTransactionValue = totalRevenue / approvedTransactions;
    return { totalRevenue, totalTransactions, approvalRate, averageTransactionValue };
  }, []);

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch = searchTerm === "" || 
        transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.terminalId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPaymentMethod = paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
      const matchesStatus = statusFilter === "all" || transaction.paymentStatus === statusFilter;
      const matchesCampus = campusFilter === "all" || transaction.campus === campusFilter;
      const matchesDate = dateFilter === "all" || transaction.timestamp.toISOString().split('T')[0] === dateFilter;
      return matchesSearch && matchesPaymentMethod && matchesStatus && matchesCampus && matchesDate;
    });
  }, [searchTerm, paymentMethodFilter, statusFilter, campusFilter, dateFilter]);

  const handleExport = () => exportToCSV(filteredTransactions);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-800 bg-clip-text text-transparent">
            Transaction Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Real-time transaction monitoring and reconciliation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={`R${stats.totalRevenue.toFixed(2)}`}
          description={`Avg: R${stats.averageTransactionValue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
          gradient="linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)"
        />
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions.toString()}
          description="All payment attempts"
          icon={Activity}
          trend={{ value: 8.2, isPositive: true }}
          gradient="linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)"
        />
        <StatsCard
          title="Successful"
          value={mockTransactions.filter(t => t.paymentStatus === "approved").length.toString()}
          description={`Success Rate: ${stats.approvalRate.toFixed(1)}%`}
          icon={CreditCard}
          trend={{ value: 3.1, isPositive: true }}
          gradient="linear-gradient(135deg, #10B981 0%, #059669 100%)"
        />
        <StatsCard
          title="Declined"
          value={mockTransactions.filter(t => t.paymentStatus === "declined").length.toString()}
          description={`Decline Rate: ${((mockTransactions.filter(t => t.paymentStatus === "declined").length / stats.totalTransactions) * 100).toFixed(1)}%`}
          icon={DollarSign}
          trend={{ value: 2.3, isPositive: false }}
          gradient="linear-gradient(135deg, #EF4444 0%, #DC2626 100%)"
        />
      </div>

      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodChange={setPaymentMethodFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        campusFilter={campusFilter}
        onCampusChange={setCampusFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        onExport={handleExport}
        totalRecords={mockTransactions.length}
        filteredRecords={filteredTransactions.length}
      />

      <Card className="shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
          <p className="text-sm text-muted-foreground mt-1">Detailed view of all transactions</p>
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </Card>
    </div>
  );
};

export default Index;
