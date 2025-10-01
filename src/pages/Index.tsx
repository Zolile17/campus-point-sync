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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 via-red-700 to-black bg-clip-text text-transparent">
            Transaction Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">Real-time transaction monitoring and reconciliation</p>
        </div>
        <div className="text-right">
        
         
        </div>
      </div>

      {/* Stats Cards */}
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
          gradient="linear-gradient(135deg, #4F46E5 0%, #2563EB 100%)"
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