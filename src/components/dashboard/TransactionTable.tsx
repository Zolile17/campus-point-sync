import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4" />;
      case "declined":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" => {
    switch (status) {
      case "approved":
        return "default";
      case "declined":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Transaction #</TableHead>
            <TableHead className="font-semibold">Date & Time</TableHead>
            <TableHead className="font-semibold">Terminal ID</TableHead>
            <TableHead className="font-semibold">Campus</TableHead>
            <TableHead className="font-semibold">Items</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
            <TableHead className="font-semibold">Payment</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{transaction.transactionNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{format(transaction.timestamp, "MMM dd, yyyy")}</span>
                    <span className="text-xs text-muted-foreground">{format(transaction.timestamp, "HH:mm:ss")}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{transaction.terminalId}</TableCell>
                <TableCell>{transaction.campus.replace('Capsicum-CCS ', '')}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 max-w-xs">
                    {transaction.cartItems.map((item, idx) => (
                      <span key={idx} className="text-sm">
                        {item.quantity}x {item.name} <span className="text-muted-foreground">(R{item.price})</span>
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                    R{(transaction.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm capitalize">{transaction.paymentMethod}</span>
                    {transaction.cardLastFour && (
                      <span className="text-xs text-muted-foreground">****{transaction.cardLastFour}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusVariant(transaction.paymentStatus)}
                    className="gap-1 capitalize"
                  >
                    {getStatusIcon(transaction.paymentStatus)}
                    {transaction.paymentStatus}
                  </Badge>
                  {transaction.declineReason && (
                    <p className="text-xs text-muted-foreground mt-1">{transaction.declineReason}</p>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};