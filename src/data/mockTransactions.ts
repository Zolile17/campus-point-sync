import { Transaction } from "@/types/transaction";

export const mockTransactions: Transaction[] = [
  
  {
    id: "1",
    transactionNumber: "TXN-2025-001",
    timestamp: new Date("2025-09-29T08:23:45"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "1", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "2", name: "Cappuccino", quantity: 1, price: 35, category: "Beverages" },
      { id: "3", name: "Bacon", quantity: 1, price: 25, category: "Add-ons" }
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
      { id: "4", name: "Cajun Chicken Wrap with Fries", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "5", name: "Soft Drinks", quantity: 1, price: 25, category: "Beverages" }
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
      { id: "6", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "7", name: "Five Roses Tea", quantity: 1, price: 20, category: "Beverages" }
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
      { id: "8", name: "Breakfast Croissant", quantity: 2, price: 70, category: "All Day Menu" },
      { id: "9", name: "Mocha", quantity: 2, price: 45, category: "Beverages" }
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
      { id: "10", name: "Cajun Beef Wrap with Fries", quantity: 1, price: 75, category: "All Day Menu" },
      { id: "11", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "Beverages" },
      { id: "12", name: "Avocado", quantity: 1, price: 20, category: "Add-ons" }
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
      { id: "13", name: "Granola Cups", quantity: 1, price: 65, category: "All Day Menu" },
      { id: "14", name: "Espresso", quantity: 1, price: 25, category: "Beverages" }
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
      { id: "15", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "16", name: "Rooibos", quantity: 1, price: 25, category: "Beverages" }
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
      { id: "17", name: "Chicken Mayo Toastie with Fries", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "18", name: "Hot Chocolate", quantity: 1, price: 40, category: "Beverages" },
      { id: "19", name: "Cheese", quantity: 1, price: 15, category: "Add-ons" }
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
      { id: "20", name: "Triple Cheese with Fries", quantity: 1, price: 40, category: "All Day Menu" },
      { id: "21", name: "Strawnana Smoothie", quantity: 1, price: 65, category: "Beverages" }
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
      { id: "22", name: "Cajun Beef Wrap with Fries", quantity: 1, price: 75, category: "All Day Menu" },
      { id: "23", name: "Soft Drinks", quantity: 1, price: 25, category: "Beverages" }
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
      { id: "24", name: "Breakfast Croissant", quantity: 1, price: 70, category: "All Day Menu" },
      { id: "25", name: "Cappuccino", quantity: 1, price: 35, category: "Beverages" },
      { id: "26", name: "Fries", quantity: 1, price: 20, category: "Add-ons" }
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
      { id: "27", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "28", name: "Cappuccino", quantity: 1, price: 35, category: "Beverages" }
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
      { id: "29", name: "Breakfast Croissant", quantity: 1, price: 70, category: "All Day Menu" },
      { id: "30", name: "Espresso", quantity: 1, price: 25, category: "Beverages" }
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
      { id: "31", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "32", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "Beverages" }
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
      { id: "33", name: "Cajun Chicken Wrap with Fries", quantity: 2, price: 60, category: "All Day Menu" },
      { id: "34", name: "Soft Drinks", quantity: 2, price: 25, category: "Beverages" }
    ],
    subtotal: 170,
    tax: 25.5,
    total: 195.5,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "4532"
  },
{
    id: "1",
    transactionNumber: "TXN-2025-001",
    timestamp: new Date("2025-09-29T08:23:45"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "item-1-1", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-1-2", name: "Cappuccino", quantity: 1, price: 35, category: "Beverages" },
      { id: "item-1-3", name: "Bacon", quantity: 1, price: 25, category: "Add-ons" }
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
      { id: "item-2-1", name: "Cajun Chicken Wrap with Fries", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-2-2", name: "Soft Drinks", quantity: 1, price: 25, category: "Beverages" }
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
      { id: "item-3-1", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-3-2", name: "Five Roses Tea", quantity: 1, price: 20, category: "Beverages" }
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
      { id: "item-4-1", name: "Breakfast Croissant", quantity: 2, price: 70, category: "All Day Menu" },
      { id: "item-4-2", name: "Mocha", quantity: 2, price: 45, category: "Beverages" }
    ],
    subtotal: 230,
    tax: 34.5,
    total: 264.50,
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
      { id: "item-5-1", name: "Cajun Beef Wrap with Fries", quantity: 1, price: 75, category: "All Day Menu" },
      { id: "item-5-2", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "Beverages" },
      { id: "item-5-3", name: "Avocado", quantity: 1, price: 20, category: "Add-ons" }
    ],
    subtotal: 155,
    tax: 23.25,
    total: 178.25,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "2147"
  },

  // NEW OCTOBER 1ST DATA - DURBAN CAMPUS
  {
    id: "14",
    transactionNumber: "TXN-2025-014",
    timestamp: new Date("2025-10-01T07:30:22"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "item-14-1", name: "Breakfast Croissant", quantity: 1, price: 70, category: "All Day Menu" },
      { id: "item-14-2", name: "Cappuccino", quantity: 1, price: 35, category: "Beverages" }
    ],
    subtotal: 105,
    tax: 15.75,
    total: 120.75,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "3421"
  },
  {
    id: "15",
    transactionNumber: "TXN-2025-015",
    timestamp: new Date("2025-10-01T08:15:44"),
    terminalId: "TERM-004",
    campus: "Capsicum-CCS Pretoria",
    cartItems: [
      { id: "item-15-1", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-15-2", name: "Latte", quantity: 1, price: 40, category: "Beverages" },
      { id: "item-15-3", name: "Bacon", quantity: 1, price: 25, category: "Add-ons" }
    ],
    subtotal: 125,
    tax: 18.75,
    total: 143.75,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "7654"
  },
  {
    id: "16",
    transactionNumber: "TXN-2025-016",
    timestamp: new Date("2025-10-01T09:02:11"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "item-16-1", name: "Triple Cheese with Fries", quantity: 1, price: 40, category: "All Day Menu" },
      { id: "item-16-2", name: "Strawnana Smoothie", quantity: 1, price: 65, category: "Beverages" }
    ],
    subtotal: 105,
    tax: 15.75,
    total: 120.75,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "9988"
  },
  {
    id: "17",
    transactionNumber: "TXN-2025-017",
    timestamp: new Date("2025-10-01T09:45:33"),
    terminalId: "TERM-004",
    campus: "Capsicum-CCS Pretoria",
    cartItems: [
      { id: "item-17-1", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-17-2", name: "Rooibos", quantity: 1, price: 25, category: "Beverages" }
    ],
    subtotal: 85,
    tax: 12.75,
    total: 97.75,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "2233"
  },
  {
    id: "18",
    transactionNumber: "TXN-2025-018",
    timestamp: new Date("2025-10-01T10:20:55"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "item-18-1", name: "Cajun Chicken Wrap with Fries", quantity: 2, price: 60, category: "All Day Menu" },
      { id: "item-18-2", name: "Soft Drinks", quantity: 2, price: 25, category: "Beverages" }
    ],
    subtotal: 170,
    tax: 25.5,
    total: 195.5,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "5566"
  },
  {
    id: "19",
    transactionNumber: "TXN-2025-019",
    timestamp: new Date("2025-10-01T11:05:21"),
    terminalId: "TERM-004",
    campus: "Capsicum-CCS Pretoria",
    cartItems: [
      { id: "item-19-1", name: "Cajun Beef Wrap with Fries", quantity: 1, price: 75, category: "All Day Menu" },
      { id: "item-19-2", name: "Mocha", quantity: 1, price: 45, category: "Beverages" },
      { id: "item-19-3", name: "Fries", quantity: 1, price: 20, category: "Add-ons" }
    ],
    subtotal: 140,
    tax: 21,
    total: 161,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "8899"
  },
  {
    id: "20",
    transactionNumber: "TXN-2025-020",
    timestamp: new Date("2025-10-01T11:50:44"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "item-20-1", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-20-2", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "Beverages" }
    ],
    subtotal: 120,
    tax: 18,
    total: 138,
    paymentMethod: "debit",
    paymentStatus: "declined",
    cardLastFour: "4455",
    declineReason: "Card expired"
  },
  {
    id: "21",
    transactionNumber: "TXN-2025-021",
    timestamp: new Date("2025-10-01T12:30:17"),
    terminalId: "TERM-004",
    campus: "Capsicum-CCS Pretoria",
    cartItems: [
      { id: "item-21-1", name: "Triple Cheese with Fries", quantity: 2, price: 40, category: "All Day Menu" },
      { id: "item-21-2", name: "Cappuccino", quantity: 2, price: 35, category: "Beverages" }
    ],
    subtotal: 150,
    tax: 22.5,
    total: 172.5,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "1122"
  },
  {
    id: "22",
    transactionNumber: "TXN-2025-022",
    timestamp: new Date("2025-10-01T13:15:39"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "item-22-1", name: "Breakfast Croissant", quantity: 1, price: 70, category: "All Day Menu" },
      { id: "item-22-2", name: "Latte", quantity: 1, price: 40, category: "Beverages" },
      { id: "item-22-3", name: "Avocado", quantity: 1, price: 20, category: "Add-ons" }
    ],
    subtotal: 130,
    tax: 19.5,
    total: 149.5,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "6677"
  },
  {
    id: "23",
    transactionNumber: "TXN-2025-023",
    timestamp: new Date("2025-10-01T14:02:55"),
    terminalId: "TERM-004",
    campus: "Capsicum-CCS Pretoria",
    cartItems: [
      { id: "item-23-1", name: "Cajun Chicken Wrap with Fries", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-23-2", name: "Five Roses Tea", quantity: 1, price: 20, category: "Beverages" }
    ],
    subtotal: 80,
    tax: 12,
    total: 92,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "3344"
  },
  {
    id: "24",
    transactionNumber: "TXN-2025-024",
    timestamp: new Date("2025-10-01T14:45:12"),
    terminalId: "TERM-002",
    campus: "Capsicum-CCS Durban",
    cartItems: [
      { id: "item-24-1", name: "Avo and Egg Toast", quantity: 2, price: 60, category: "All Day Menu" },
      { id: "item-24-2", name: "Strawnana Smoothie", quantity: 2, price: 65, category: "Beverages" }
    ],
    subtotal: 250,
    tax: 37.5,
    total: 287.5,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "7788"
  },
  {
    id: "25",
    transactionNumber: "TXN-2025-025",
    timestamp: new Date("2025-10-01T15:20:33"),
    terminalId: "TERM-004",
    campus: "Capsicum-CCS Pretoria",
    cartItems: [
      { id: "item-25-1", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-25-2", name: "Mocha", quantity: 1, price: 45, category: "Beverages" },
      { id: "item-25-3", name: "Bacon", quantity: 1, price: 25, category: "Add-ons" }
    ],
    subtotal: 130,
    tax: 19.5,
    total: 149.5,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "9900"
  },

  // Additional October 1st transactions for existing campuses
  {
    id: "26",
    transactionNumber: "TXN-2025-026",
    timestamp: new Date("2025-10-01T08:45:22"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "item-26-1", name: "Breakfast Croissant", quantity: 1, price: 70, category: "All Day Menu" },
      { id: "item-26-2", name: "Espresso", quantity: 1, price: 25, category: "Beverages" }
    ],
    subtotal: 95,
    tax: 14.25,
    total: 109.25,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "4321"
  },
  {
    id: "27",
    transactionNumber: "TXN-2025-027",
    timestamp: new Date("2025-10-01T10:30:44"),
    terminalId: "TERM-003",
    campus: "Capsicum-CCS Nelson Mandela Bay",
    cartItems: [
      { id: "item-27-1", name: "Triple Cheese with Fries", quantity: 1, price: 40, category: "All Day Menu" },
      { id: "item-27-2", name: "Soft Drinks", quantity: 1, price: 25, category: "Beverages" }
    ],
    subtotal: 65,
    tax: 9.75,
    total: 74.75,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "6543"
  },
  {
    id: "28",
    transactionNumber: "TXN-2025-028",
    timestamp: new Date("2025-10-01T12:15:11"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "item-28-1", name: "Cajun Beef Wrap with Fries", quantity: 1, price: 75, category: "All Day Menu" },
      { id: "item-28-2", name: "Cappuccino", quantity: 1, price: 35, category: "Beverages" }
    ],
    subtotal: 110,
    tax: 16.5,
    total: 126.5,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "8765"
  },
  {
    id: "29",
    transactionNumber: "TXN-2025-029",
    timestamp: new Date("2025-10-01T13:45:33"),
    terminalId: "TERM-003",
    campus: "Capsicum-CCS Nelson Mandela Bay",
    cartItems: [
      { id: "item-29-1", name: "Grilled Chicken Salad", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-29-2", name: "Glow-Up Smoothie", quantity: 1, price: 60, category: "Beverages" },
      { id: "item-29-3", name: "Avocado", quantity: 1, price: 20, category: "Add-ons" }
    ],
    subtotal: 140,
    tax: 21,
    total: 161,
    paymentMethod: "credit",
    paymentStatus: "approved",
    cardLastFour: "2109"
  },
  {
    id: "30",
    transactionNumber: "TXN-2025-030",
    timestamp: new Date("2025-10-01T15:10:55"),
    terminalId: "TERM-001",
    campus: "Capsicum-CCS Cape Town",
    cartItems: [
      { id: "item-30-1", name: "Avo and Egg Toast", quantity: 1, price: 60, category: "All Day Menu" },
      { id: "item-30-2", name: "Latte", quantity: 1, price: 40, category: "Beverages" }
    ],
    subtotal: 100,
    tax: 15,
    total: 115,
    paymentMethod: "debit",
    paymentStatus: "approved",
    cardLastFour: "5432"
  }
];
