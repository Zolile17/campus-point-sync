export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: "food" | "beverage" | "add-on";
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  timestamp: Date;
  terminalId: string;
  campus: string;
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "debit" | "credit";
  paymentStatus: "approved" | "declined" | "pending";
  cardLastFour?: string;
  declineReason?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  approvalRate: number;
  averageTransactionValue: number;
}
