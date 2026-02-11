import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, Calendar, X } from "lucide-react";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  campusFilter: string;
  onCampusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  dateRange?: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onExport: () => void;
  totalRecords: number;
  filteredRecords: number;
}

export const TransactionFilters = ({
  searchTerm,
  onSearchChange,
  paymentMethodFilter,
  onPaymentMethodChange,
  statusFilter,
  onStatusChange,
  campusFilter,
  onCampusChange,
  dateFilter,
  onDateChange,
  dateRange = { from: undefined, to: undefined },
  onDateRangeChange,
  onExport,
  totalRecords,
  filteredRecords,
}: TransactionFiltersProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);

  const handleQuickDateSelect = (value: string) => {
    if (value === "custom") {
      setShowCustomRange(true);
      if (onDateChange) onDateChange("custom");
    } else {
      setShowCustomRange(false);
      if (onDateChange) onDateChange(value);
      if (onDateRangeChange) onDateRangeChange({ from: undefined, to: undefined });
    }
  };

  const handleApplyRange = () => {
    if (startDate && endDate && onDateRangeChange) {
      onDateRangeChange({ from: new Date(startDate), to: new Date(endDate) });
      setShowCustomRange(false);
    }
  };

  const handleClearRange = () => {
    setStartDate("");
    setEndDate("");
    setShowCustomRange(false);
    if (onDateChange) onDateChange("all");
    if (onDateRangeChange) onDateRangeChange({ from: undefined, to: undefined });
  };

  const getDateFilterDisplay = () => {
    if (dateFilter === "custom" && dateRange.from && dateRange.to) {
      return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
    }
    switch (dateFilter) {
      case "2025-10-01": return "Today";
      case "2025-09-30": return "Yesterday";
      case "all": return "All Dates";
      case "custom": return "Custom Range";
      default: return "All Dates";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Active Filters:</span>
          {statusFilter !== 'all' && (
            <span className="px-2 py-1 bg-primary/20 rounded text-primary-foreground bg-primary/30">Status: {statusFilter}</span>
          )}
          {paymentMethodFilter !== 'all' && (
            <span className="px-2 py-1 bg-primary/20 rounded text-primary-foreground bg-primary/30">Payment: {paymentMethodFilter}</span>
          )}
          {campusFilter !== 'all' && (
            <span className="px-2 py-1 bg-primary/20 rounded text-primary-foreground bg-primary/30">Campus: {campusFilter.replace('Intellergy Cafe ', '')}</span>
          )}
          {dateFilter !== 'all' && (
            <span className="px-2 py-1 bg-primary/20 rounded text-primary-foreground bg-primary/30">Date: {getDateFilterDisplay()}</span>
          )}
          {statusFilter === 'all' && paymentMethodFilter === 'all' && campusFilter === 'all' && dateFilter === 'all' && (
            <span className="text-muted-foreground">None</span>
          )}
        </div>
        <span className="text-sm text-primary font-medium">
          Showing {filteredRecords} of {totalRecords} records
        </span>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by transaction # or terminal ID..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={onExport} className="gap-2 bg-gradient-to-r from-green-700 to-green-900 text-white hover:from-green-800 hover:to-green-950 transition-all">
                <Download className="h-4 w-4" />
                Export CSV ({filteredRecords})
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={campusFilter} onValueChange={onCampusChange}>
                <SelectTrigger><SelectValue placeholder="All Campuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Intellergy Cafe Cape Town">Cape Town</SelectItem>
                  <SelectItem value="Intellergy Cafe Durban">Durban</SelectItem>
                  <SelectItem value="Intellergy Cafe Nelson Mandela Bay">Nelson Mandela Bay</SelectItem>
                  <SelectItem value="Intellergy Cafe Pretoria">Pretoria</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={onPaymentMethodChange}>
                <SelectTrigger><SelectValue placeholder="All Payment Methods" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={handleQuickDateSelect}>
                <SelectTrigger><SelectValue placeholder="All Dates" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="2025-10-01">Today</SelectItem>
                  <SelectItem value="2025-09-30">Yesterday</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {showCustomRange && (
        <Card className="shadow-sm border-2 border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Custom Date Range</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCustomRange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Start Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">End Date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleClearRange}>Clear</Button>
              <Button onClick={handleApplyRange} disabled={!startDate || !endDate} className="bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900">
                Apply Range
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
