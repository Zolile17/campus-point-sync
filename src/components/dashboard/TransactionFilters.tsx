import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Search, X } from "lucide-react";
import { CAMPUS_NAMES } from "@/data/menu";
import { DatePreset, presetLabel } from "@/lib/demoClock";

export interface FilterState {
  search: string;
  campus: string;
  method: string;
  status: string;
  date: DatePreset;
  customFrom: string;
  customTo: string;
}

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  campus: "all",
  method: "all",
  status: "all",
  date: "today",
  customFrom: "",
  customTo: "",
};

interface TransactionFiltersProps {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onExport: () => void;
  minDate: string;
  maxDate: string;
  filteredRecords: number;
}

export const TransactionFilters = ({ value, onChange, onExport, minDate, maxDate, filteredRecords }: TransactionFiltersProps) => {
  const set = <K extends keyof FilterState>(k: K, v: FilterState[K]) => onChange({ ...value, [k]: v });

  const chips: { label: string; clear: () => void }[] = [];
  if (value.campus !== "all") chips.push({ label: value.campus, clear: () => set("campus", "all") });
  if (value.method !== "all") chips.push({ label: value.method === "debit" ? "Debit" : "Credit", clear: () => set("method", "all") });
  if (value.status !== "all") chips.push({ label: value.status[0].toUpperCase() + value.status.slice(1), clear: () => set("status", "all") });
  if (value.search) chips.push({ label: `“${value.search}”`, clear: () => set("search", "") });

  return (
    <div className="space-y-3 border-b border-border px-5 py-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search transaction #, terminal, cashier or item…"
            value={value.search}
            onChange={(e) => set("search", e.target.value)}
            className="h-9 pl-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
          <Select value={value.date} onValueChange={(v) => set("date", v as DatePreset)}>
            <SelectTrigger className="h-9 lg:w-[150px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {(["today", "yesterday", "7d", "30d", "all", "custom"] as DatePreset[]).map((p) => (
                <SelectItem key={p} value={p}>{presetLabel[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={value.campus} onValueChange={(v) => set("campus", v)}>
            <SelectTrigger className="h-9 lg:w-[170px]"><SelectValue placeholder="All campuses" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All campuses</SelectItem>
              {CAMPUS_NAMES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={value.method} onValueChange={(v) => set("method", v)}>
            <SelectTrigger className="h-9 lg:w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All methods</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={value.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger className="h-9 lg:w-[130px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onExport} size="sm" className="h-9 gap-2" disabled={filteredRecords === 0}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {value.date === "custom" && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg bg-muted/60 p-3">
          <label className="text-xs font-medium text-muted-foreground">
            From
            <Input
              type="date"
              min={minDate}
              max={value.customTo || maxDate}
              value={value.customFrom}
              onChange={(e) => set("customFrom", e.target.value)}
              className="mt-1 h-9 w-[160px] bg-card"
            />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            To
            <Input
              type="date"
              min={value.customFrom || minDate}
              max={maxDate}
              value={value.customTo}
              onChange={(e) => set("customTo", e.target.value)}
              className="mt-1 h-9 w-[160px] bg-card"
            />
          </label>
          {!(value.customFrom && value.customTo) && (
            <p className="pb-2 text-xs text-muted-foreground">Pick both dates to apply the range.</p>
          )}
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button
              key={c.label}
              onClick={c.clear}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium transition-colors hover:border-foreground/30"
            >
              {c.label}
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          ))}
          <button
            onClick={() => onChange({ ...DEFAULT_FILTERS, date: value.date, customFrom: value.customFrom, customTo: value.customTo })}
            className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
