import { Transaction } from "@/types/transaction";

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    transactionNumber: "TXN-2025-001",
    timestamp: new Date("2025-09-29T08:23:45"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "1", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "food" },
      { id: "2", name: "Cappuccino", quantity: 1, price: 35, category: "beverage" },
      { id: "3", name: "Bacon", quantity: 1, price: 25, category: "add-on" }
    ],
    subtotal: 120,
    tax: 18,
    total: 138,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "4532"
  },
  {
    id: "2",
    transactionNumber: "TXN-2025-002",
    timestamp: new Date("2025-09-29T09:45:12"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "4", name: "Cajun Chicken Wrap with Fries", quantity: 1, price: 60, category: "food" },
      { id: "5", name: "Soft Drinks", quantity: 1, price: 25, category: "beverage" }
    ],
    subtotal: 85,
    tax: 12.75,
    total: 97.75,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "8821"
  },
  {
    id: "3",
    transactionNumber: "TXN-2025-003",
    timestamp: new Date("2025-09-29T10:15:33"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "6", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "food" },
      { id: "7", name: "Five Roses Tea", quantity: 1, price: 20, category: "beverage" }
    ],
    subtotal: 80,
    tax: 12,
    total: 92,
    paymentMethod: "debit",
    paymentStatus: "declined",
    cardLastFour: "8821",
    declineReason: "Insufficient funds"
  },
  {
    id: "4",
    transactionNumber: "TXN-2025-004",
    timestamp: new Date("2025-09-29T11:42:18"),
    terminalId: "TERM-003",
    campus: "Capsicum-CCS Nelson Mandela Bay",
    cartItems: [
      { id: "8", name: "Breakfast Croissant", quantity: 2, price: 70, category: "food" },
      { id: "9", name: "Mocha", quantity: 2, price: 45, category: "beverage" }
    ],
    subtotal: 230,
    tax: 34.5,
    total: 264.5,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "5512"
  },
  {
    id: "5",
    transactionNumber: "TXN-2025-005",
    timestamp: new Date("2025-09-29T12:08:55"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "10", name: "Cajun Beef Wrap with Fries", quantity: 1, price: 75, category: "food" },
      { id: "11", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "beverage" },
      { id: "12", name: "Avocado", quantity: 1, price: 20, category: "add-on" }
    ],
    subtotal: 155,
    tax: 23.25,
    total: 178.25,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "2147"
  },
  {
    id: "6",
    transactionNumber: "TXN-2025-006",
    timestamp: new Date("2025-09-29T13:34:22"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "13", name: "Granola Cup", quantity: 1, price: 65, category: "food" },
      { id: "14", name: "Espresso", quantity: 1, price: 25, category: "beverage" }
    ],
    subtotal: 90,
    tax: 13.5,
    total: 103.5,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "9634"
  },
  {
    id: "7",
    transactionNumber: "TXN-2025-007",
    timestamp: new Date("2025-09-30T08:05:41"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "15", name: "Deep Fried Chicken Salad", quantity: 1, price: 80, category: "food" },
      { id: "16", name: "Rooibos", quantity: 1, price: 25, category: "beverage" }
    ],
    subtotal: 105,
    tax: 15.75,
    total: 120.75,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "4532"
  },
  {
    id: "8",
    transactionNumber: "TXN-2025-008",
    timestamp: new Date("2025-09-30T09:28:13"),
    terminalId: "TERM-003",
    campus: "Capsicum-CCS Nelson Mandela Bay",
    cartItems: [
      { id: "17", name: "Chicken Mayo Toastie with Fries", quantity: 1, price: 60, category: "food" },
      { id: "18", name: "Hot Chocolate", quantity: 1, price: 40, category: "beverage" },
      { id: "19", name: "Cheese", quantity: 1, price: 15, category: "add-on" }
    ],
    subtotal: 115,
    tax: 17.25,
    total: 132.25,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "9634"
  },
  {
    id: "9",
    transactionNumber: "TXN-2025-009",
    timestamp: new Date("2025-09-30T10:12:47"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "20", name: "Triple Cheese with Fries", quantity: 1, price: 40, category: "food" },
      { id: "21", name: "Strawnana Smoothie", quantity: 1, price: 85, category: "beverage" }
    ],
    subtotal: 125,
    tax: 18.75,
    total: 143.75,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "2147"
  },
  {
    id: "10",
    transactionNumber: "TXN-2025-010",
    timestamp: new Date("2025-09-30T11:45:29"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "22", name: "Cajun Cous-Cous Bowl", quantity: 1, price: 60, category: "food" },
      { id: "23", name: "Soft Drinks", quantity: 1, price: 25, category: "beverage" }
    ],
    subtotal: 85,
    tax: 12.75,
    total: 97.75,
    paymentMethod: "credit",
    paymentStatus: "declined",
    cardLastFour: "5512",
    declineReason: "Card expired"
  },
  {
    id: "11",
    transactionNumber: "TXN-2025-011",
    timestamp: new Date("2025-09-30T12:18:56"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "24", name: "Bacon, Egg and Cheese Toastie", quantity: 1, price: 50, category: "food" },
      { id: "25", name: "Cappuccino", quantity: 1, price: 35, category: "beverage" },
      { id: "26", name: "Fries", quantity: 1, price: 20, category: "add-on" }
    ],
    subtotal: 105,
    tax: 15.75,
    total: 120.75,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "4532"
  },
  {
    id: "12",
    transactionNumber: "TXN-2025-012",
    timestamp: new Date("2025-09-30T13:22:15"),
    terminalId: "TERM-003",
    campus: "Capsicum-CCS Nelson Mandela Bay",
    cartItems: [
      { id: "27", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "food" },
      { id: "28", name: "Cappuccino", quantity: 1, price: 35, category: "beverage" }
    ],
    subtotal: 95,
    tax: 14.25,
    total: 109.25,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "8821"
  },
  {
    id: "13",
    transactionNumber: "TXN-2025-013",
    timestamp: new Date("2025-10-01T08:15:33"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "29", name: "Breakfast Croissant", quantity: 1, price: 70, category: "food" },
      { id: "30", name: "Espresso", quantity: 1, price: 25, category: "beverage" }
    ],
    subtotal: 95,
    tax: 14.25,
    total: 109.25,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "2147"
  },
  {
    id: "14",
    transactionNumber: "TXN-2025-014",
    timestamp: new Date("2025-10-01T09:42:10"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "31", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "food" },
      { id: "32", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "beverage" }
    ],
    subtotal: 120,
    tax: 18,
    total: 138,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "9634"
  },
  {
    id: "15",
    transactionNumber: "TXN-2025-015",
    timestamp: new Date("2025-10-01T10:35:48"),
    terminalId: "TERM-003",
    campus: "Capsicum-CCS Nelson Mandela Bay",
    cartItems: [
      { id: "33", name: "Cajun Chicken Wrap with Fries", quantity: 2, price: 60, category: "food" },
      { id: "34", name: "Soft Drinks", quantity: 2, price: 25, category: "beverage" }
    ],
    subtotal: 170,
    tax: 25.5,
    total: 195.5,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "4532"
  }
];
