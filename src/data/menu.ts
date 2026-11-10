import { Campus, ItemCategory, MenuItem } from "@/types/transaction";

/** Café menu — matches the campus POS. Prices are VAT-inclusive (ZAR). */
export const MENU: MenuItem[] = [
  // All Day Menu
  { id: "avo-egg-toast", name: "Avo and Egg Toast", description: "Avo, Egg, Pickled Onions, Chilli Oil, Ciabatta/Rye Bread/Wholewheat Bread", price: 60, category: "All Day Menu" },
  { id: "breakfast-croissant", name: "Breakfast Croissant", description: "Bacon, Egg, Cheese", price: 70, category: "All Day Menu" },
  { id: "granola-cups", name: "Granola Cups", description: "Muesli, Yoghurt, Fruits, Honey", price: 65, category: "All Day Menu" },
  { id: "cajun-chicken-wrap", name: "Cajun Chicken Wrap with Fries/Side Salad", description: "Chicken, Lettuce, Tomato, Red Onion, Cucumber", price: 60, category: "All Day Menu" },
  { id: "cajun-beef-wrap", name: "Cajun Beef Wrap with Fries/Side Salad", description: "Beef Strips, Lettuce, Tomato, Red Onion, Cucumber", price: 75, category: "All Day Menu" },
  { id: "grilled-chicken-salad", name: "Grilled Chicken Salad", description: "Grilled Chicken, Mixed Greens, Feta, Cherry Tomato", price: 60, category: "All Day Menu" },
  { id: "triple-cheese", name: "Triple Cheese with Fries", description: "Cheddar, Mozzarella, Gouda on Toasted Bread", price: 40, category: "All Day Menu" },

  // Beverages
  { id: "espresso", name: "Espresso", description: "Single shot", price: 25, category: "Beverages" },
  { id: "americano", name: "Americano", description: "Espresso, Hot Water", price: 30, category: "Beverages" },
  { id: "cappuccino", name: "Cappuccino", description: "Espresso, Steamed Milk, Foam", price: 35, category: "Beverages" },
  { id: "latte", name: "Latte", description: "Espresso, Steamed Milk", price: 40, category: "Beverages" },
  { id: "mocha", name: "Mocha", description: "Espresso, Chocolate, Steamed Milk", price: 45, category: "Beverages" },
  { id: "five-roses", name: "Five Roses Tea", description: "Black tea", price: 20, category: "Beverages" },
  { id: "rooibos", name: "Rooibos", description: "Rooibos tea", price: 25, category: "Beverages" },
  { id: "soft-drinks", name: "Soft Drinks", description: "330ml can", price: 25, category: "Beverages" },
  { id: "glow-up", name: "Glow-Up Smoothie", description: "Mango, Pineapple, Ginger, Orange", price: 60, category: "Beverages" },
  { id: "strawnana", name: "Strawnana Smoothie", description: "Strawberry, Banana, Yoghurt", price: 65, category: "Beverages" },

  // Add-ons
  { id: "bacon", name: "Bacon", description: "Extra bacon", price: 25, category: "Add-ons" },
  { id: "avocado", name: "Avocado", description: "Extra avocado", price: 20, category: "Add-ons" },
  { id: "fries", name: "Fries", description: "Side of fries", price: 20, category: "Add-ons" },
  { id: "extra-egg", name: "Extra Egg", description: "Fried or scrambled", price: 15, category: "Add-ons" },
  { id: "oat-milk", name: "Oat Milk", description: "Swap for oat milk", price: 10, category: "Add-ons" },
];

export const CATEGORIES: ItemCategory[] = ["All Day Menu", "Beverages", "Add-ons"];

export interface CampusInfo {
  name: Campus;
  fullName: string;
  address: string;
  terminal: string;
  /** Relative trading volume used by the demo data generator */
  weight: number;
  cashiers: string[];
}

export const CAMPUSES: CampusInfo[] = [
  {
    name: "Cape Town",
    fullName: "Capsicum Culinary Studio · Cape Town",
    address: "Bridge House, 1 Bridge Street, Cape Town, 8001",
    terminal: "TERM-001",
    weight: 1.15,
    cashiers: ["Thabo Mkhize", "Sarah Williams"],
  },
  {
    name: "Durban",
    fullName: "Capsicum Culinary Studio · Durban",
    address: "456 Florida Road, Morningside, Durban, 4001",
    terminal: "TERM-002",
    weight: 1,
    cashiers: ["Zanele Ndlovu", "Michael Chen"],
  },
  {
    name: "Nelson Mandela Bay",
    fullName: "Capsicum Culinary Studio · Nelson Mandela Bay",
    address: "789 Cape Road, Newton Park, Gqeberha, 6045",
    terminal: "TERM-003",
    weight: 0.75,
    cashiers: ["Lindiwe Khumalo"],
  },
  {
    name: "Pretoria",
    fullName: "Capsicum Culinary Studio · Pretoria",
    address: "321 Lynnwood Road, Menlo Park, Pretoria, 0081",
    terminal: "TERM-004",
    weight: 1.05,
    cashiers: ["David van der Merwe", "Amina Osman"],
  },
];

export const CAMPUS_NAMES = CAMPUSES.map((c) => c.name);
