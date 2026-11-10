import { format } from "date-fns";
import { Transaction } from "@/types/transaction";
import { DEMO_NOW } from "@/lib/demoClock";

const escape = (cell: string | number) => `"${String(cell).replace(/"/g, '""')}"`;

export const exportToCSV = (transactions: Transaction[]) => {
  const headers = [
    "Transaction Number",
    "Date",
    "Time",
    "Campus",
    "Terminal ID",
    "Cashier",
    "Items",
    "Subtotal (excl. VAT)",
    "VAT",
    "Total",
    "Payment Method",
    "Payment Status",
    "Card Last Four",
    "Decline / Cancel Reason",
  ];

  const rows = transactions.map((t) => [
    t.transactionNumber,
    format(t.timestamp, "yyyy-MM-dd"),
    format(t.timestamp, "HH:mm:ss"),
    t.campus,
    t.terminalId,
    t.cashier,
    t.cartItems.map((i) => `${i.quantity}x ${i.name} (R${i.price})`).join("; "),
    t.subtotal.toFixed(2),
    t.tax.toFixed(2),
    t.total.toFixed(2),
    t.paymentMethod.toUpperCase(),
    t.paymentStatus.toUpperCase(),
    t.cardLastFour || "",
    t.declineReason || t.cancelReason || "",
  ]);

  const csv = [headers, ...rows].map((r) => r.map(escape).join(",")).join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `capsicum_transactions_${format(DEMO_NOW, "yyyy-MM-dd_HHmm")}.csv`;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
