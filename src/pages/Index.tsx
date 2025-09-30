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

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalRevenue = mockTransactions
      .filter(t => t.paymentStatus === "approved")
      .reduce((sum, t) => sum + t.total, 0);
    
    const totalTransactions = mockTransactions.length;
    
    const approvedTransactions = mockTransactions.filter(t => t.paymentStatus === "approved").length;
    const approvalRate = (approvedTransactions / totalTransactions) * 100;
    
    const averageTransactionValue = totalRevenue / approvedTransactions;

    return {
      totalRevenue,
      totalTransactions,
      approvalRate,
      averageTransactionValue
    };
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      const matchesSearch = 
        transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.terminalId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPaymentMethod = 
        paymentMethodFilter === "all" || transaction.paymentMethod === paymentMethodFilter;
      
      const matchesStatus = 
        statusFilter === "all" || transaction.paymentStatus === statusFilter;
      
      const matchesCampus = 
        campusFilter === "all" || transaction.campus === campusFilter;

      return matchesSearch && matchesPaymentMethod && matchesStatus && matchesCampus;
    });
  }, [searchTerm, paymentMethodFilter, statusFilter, campusFilter]);

  const handleExport = () => {
    exportToCSV(filteredTransactions);
  };

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time transaction monitoring and reconciliation</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-lg font-semibold text-foreground">
            {new Date().toLocaleTimeString('en-ZA', { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Transactions"
          value={stats.totalTransactions.toString()}
          description="All payment attempts"
          icon={Activity}
          trend={{ value: 8.2, isPositive: true }}
          gradient="var(--gradient-blue)"
        />
        <StatsCard
          title="Successful"
          value={mockTransactions.filter(t => t.paymentStatus === "approved").length.toString()}
          description={`Success Rate: ${stats.approvalRate.toFixed(1)}%`}
          icon={CreditCard}
          trend={{ value: 3.1, isPositive: true }}
          gradient="var(--gradient-green)"
        />
        <StatsCard
          title="Declined"
          value={mockTransactions.filter(t => t.paymentStatus === "declined").length.toString()}
          description={`Decline Rate: ${((mockTransactions.filter(t => t.paymentStatus === "declined").length / stats.totalTransactions) * 100).toFixed(1)}%`}
          icon={DollarSign}
          gradient="var(--gradient-red)"
        />
        <StatsCard
          title="Total Revenue"
          value={`R${stats.totalRevenue.toFixed(2)}`}
          description={`Avg: R${stats.averageTransactionValue.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
          gradient="var(--gradient-purple)"
        />
      </div>

      {/* Filters */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodChange={setPaymentMethodFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        campusFilter={campusFilter}
        onCampusChange={setCampusFilter}
        onExport={handleExport}
        totalRecords={mockTransactions.length}
        filteredRecords={filteredTransactions.length}
      />

      {/* Transaction Table */}
      <Card className="shadow-sm">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed view of all transactions
          </p>
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </Card>
    </div>
  );
};

export default Index;
