export type ItemCategory = "All Day Menu" | "Beverages" | "Add-ons";

export type Campus = "Cape Town" | "Durban" | "Nelson Mandela Bay" | "Pretoria";

export type PaymentMethod = "debit" | "credit";

export type PaymentStatus = "approved" | "declined" | "pending" | "cancelled";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ItemCategory;
}

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: ItemCategory;
}

export interface Transaction {
  id: string;
  transactionNumber: string;
  timestamp: Date;
  terminalId: string;
  campus: Campus;
  cashier: string;
  cartItems: CartItem[];
  /** Amount excluding VAT */
  subtotal: number;
  /** VAT portion (15%, prices are VAT-inclusive) */
  tax: number;
  /** Amount charged to the card */
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  cardLastFour?: string;
  declineReason?: string;
  /** Why the sale was cancelled before payment completed */
  cancelReason?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalTransactions: number;
  approvalRate: number;
  averageTransactionValue: number;
}
