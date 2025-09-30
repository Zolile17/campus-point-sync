import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onExport
}: TransactionFiltersProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-3 md:flex-row md:items-center flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by transaction number or cashier..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={campusFilter} onValueChange={onCampusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Campuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campuses</SelectItem>
            <SelectItem value="Main Campus">Main Campus</SelectItem>
            <SelectItem value="East Campus">East Campus</SelectItem>
            <SelectItem value="West Campus">West Campus</SelectItem>
          </SelectContent>
        </Select>

        <Select value={paymentMethodFilter} onValueChange={onPaymentMethodChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="card">Card</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onExport} className="gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};
