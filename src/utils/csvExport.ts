import { Transaction } from "@/types/transaction";

export const exportToCSV = (transactions: Transaction[]) => {
  // Define CSV headers
  const headers = [
    "Transaction Number",
    "Date",
    "Time",
    "Cashier",
    "Campus",
    "Items",
    "Subtotal",
    "Tax",
    "Total",
    "Payment Method",
    "Payment Status",
    "Card Last Four",
    "Decline Reason"
  ];

  // Convert transactions to CSV rows
  const rows = transactions.map(transaction => {
    const itemsList = transaction.cartItems
      .map(item => `${item.name} (${item.quantity}x R${item.price})`)
      .join("; ");

    return [
      transaction.transactionNumber,
      new Date(transaction.timestamp).toLocaleDateString(),
      new Date(transaction.timestamp).toLocaleTimeString(),
      transaction.cashier,
      transaction.campus,
      itemsList,
      `R${transaction.subtotal.toFixed(2)}`,
      `R${transaction.tax.toFixed(2)}`,
      `R${transaction.total.toFixed(2)}`,
      transaction.paymentMethod.toUpperCase(),
      transaction.paymentStatus.toUpperCase(),
      transaction.cardLastFour || "N/A",
      transaction.declineReason || "N/A"
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", `capsicum_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
