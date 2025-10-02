import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search } from "lucide-react";

interface TransactionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  paymentMethodFilter: string;
  onPaymentMethodChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  campusFilter: string;
  onCampusChange: (value: string) => void;
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
  onExport,
  totalRecords,
  filteredRecords,
}: TransactionFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Active Filters Bar */}
      <div className="bg-info/10 border border-info/20 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Active Filters:</span>
          {statusFilter !== 'all' && (
            <span className="px-2 py-1 bg-info/20 rounded text-info-foreground">
              Status: {statusFilter}
            </span>
          )}
          {paymentMethodFilter !== 'all' && (
            <span className="px-2 py-1 bg-info/20 rounded text-info-foreground">
              Payment: {paymentMethodFilter}
            </span>
          )}
          {campusFilter !== 'all' && (
            <span className="px-2 py-1 bg-info/20 rounded text-info-foreground">
              Campus: {campusFilter.replace('Capsicum-CCS ', '')}
            </span>
          )}
          {statusFilter === 'all' && paymentMethodFilter === 'all' && campusFilter === 'all' && (
            <span className="text-muted-foreground">None</span>
          )}
        </div>
        <span className="text-sm text-info font-medium">
          Showing {filteredRecords} of {totalRecords} records
        </span>
      </div>

      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            {/* Search and Export Row */}
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
              <Button onClick={onExport} className="gap-2 bg-gradient-to-r from-red-600 to-black text-white hover:from-red-700 hover:to-gray-900 transition-all">
                <Download className="h-4 w-4" />
                Export CSV ({filteredRecords})
              </Button>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={campusFilter} onValueChange={onCampusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Campuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campuses</SelectItem>
                  <SelectItem value="Capsicum-CCS Cape Town">Cape Town</SelectItem>
                  <SelectItem value="Capsicum-CCS Durban">Durban</SelectItem>
                  <SelectItem value="Capsicum-CCS Nelson Mandela Bay">Nelson Mandela Bay</SelectItem>
                  <SelectItem value="Capsicum-CCS Pretoria">Pretoria</SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentMethodFilter} onValueChange={onPaymentMethodChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Payment Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};