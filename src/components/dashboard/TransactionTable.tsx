import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { format, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, CreditCard, Receipt } from "lucide-react";
import { StatusPill } from "@/components/shared/StatusPill";
import { DEMO_NOW, formatRand } from "@/lib/demoClock";

interface TransactionTableProps {
  transactions: Transaction[];
  pageSize?: number;
}

export const TransactionTable = ({ transactions, pageSize = 15 }: TransactionTableProps) => {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(transactions.length / pageSize));

  useEffect(() => setPage(0), [transactions]);

  const rows = transactions.slice(page * pageSize, page * pageSize + pageSize);
  const start = transactions.length ? page * pageSize + 1 : 0;
  const end = Math.min(transactions.length, (page + 1) * pageSize);

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="h-10 pl-5 text-xs font-medium uppercase tracking-wide">Transaction</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Time</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Campus</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Items</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Payment</TableHead>
              <TableHead className="h-10 text-xs font-medium uppercase tracking-wide">Status</TableHead>
              <TableHead className="h-10 pr-5 text-right text-xs font-medium uppercase tracking-wide">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="mx-auto flex max-w-xs flex-col items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">No transactions match</p>
                    <p className="text-xs text-muted-foreground">Try a wider date range or clear some filters.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((t) => (
                <TableRow key={t.id} className="border-border">
                  <TableCell className="pl-5 align-top">
                    <p className="font-mono text-[13px] font-medium">{t.transactionNumber}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t.terminalId} · {t.cashier}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap align-top">
                    <p className="tabular text-sm">{format(t.timestamp, "HH:mm:ss")}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {isSameDay(t.timestamp, DEMO_NOW) ? "Today" : format(t.timestamp, "EEE d MMM")}
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap align-top text-sm">{t.campus}</TableCell>
                  <TableCell className="min-w-[220px] align-top">
                    <ul className="space-y-0.5">
                      {t.cartItems.map((item) => (
                        <li key={item.id} className="text-sm">
                          <span className="text-muted-foreground">{item.quantity}×</span> {item.name}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="whitespace-nowrap align-top">
                    <p className="flex items-center gap-1.5 text-sm capitalize">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                      {t.paymentMethod}
                    </p>
                    {t.cardLastFour && (
                      <p className="mt-0.5 font-mono text-xs text-muted-foreground">•••• {t.cardLastFour}</p>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <StatusPill status={t.paymentStatus} />
                    {(t.declineReason || t.cancelReason) && (
                      <p className="mt-1 text-xs text-muted-foreground">{t.declineReason || t.cancelReason}</p>
                    )}
                  </TableCell>
                  <TableCell className="pr-5 text-right align-top">
                    <span className="tabular text-sm font-semibold">{formatRand(t.total)}</span>
                    <p className="tabular mt-0.5 whitespace-nowrap text-xs text-muted-foreground">VAT {formatRand(t.tax)}</p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground sm:flex-row">
        <span className="tabular">
          {start}–{end} of {transactions.length.toLocaleString("en-US")} transactions
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page === 0} onClick={() => setPage((p) => p - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="tabular min-w-[70px] text-center">Page {page + 1} of {pages}</span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
