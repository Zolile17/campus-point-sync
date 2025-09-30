import { useState, useMemo } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionFilters } from "@/components/dashboard/TransactionFilters";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
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
        transaction.cashier.toLowerCase().includes(searchTerm.toLowerCase());
      
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Capsicum Reconciliation</h1>
              <p className="text-muted-foreground mt-1">Campus Food Service Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Today's Date</p>
              <p className="text-lg font-semibold text-foreground">
                {new Date().toLocaleDateString('en-ZA', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Revenue"
            value={`R${stats.totalRevenue.toFixed(2)}`}
            description="From approved transactions"
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatsCard
            title="Total Transactions"
            value={stats.totalTransactions.toString()}
            description="All payment attempts"
            icon={Activity}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="Approval Rate"
            value={`${stats.approvalRate.toFixed(1)}%`}
            description="Successfully processed"
            icon={CreditCard}
            trend={{ value: 3.1, isPositive: true }}
          />
          <StatsCard
            title="Avg Transaction"
            value={`R${stats.averageTransactionValue.toFixed(2)}`}
            description="Per approved order"
            icon={TrendingUp}
            trend={{ value: 5.4, isPositive: true }}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
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
          />
        </div>

        {/* Transaction Table */}
        <div className="bg-card rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {filteredTransactions.length} of {mockTransactions.length} transactions
            </p>
          </div>
          <TransactionTable transactions={filteredTransactions} />
        </div>
      </main>
    </div>
  );
};

export default Index;
