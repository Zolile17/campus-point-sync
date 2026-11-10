import { addDays, format, startOfDay } from "date-fns";
import { CartItem, MenuItem, PaymentMethod, PaymentStatus, Transaction } from "@/types/transaction";
import { CAMPUSES, MENU } from "@/data/menu";
import { DEMO_NOW } from "@/lib/demoClock";

/**
 * Demo transactions for the 70 days leading up to DEMO_NOW
 * (Tue 10 Nov 2026, 10:00). Generated with a seeded PRNG so every reload
 * shows exactly the same data.
 *
 * Trading pattern:
 *  - Mon–Fri 07:00–16:00, Sat 08:00–13:00 (lighter), closed Sundays
 *  - Breakfast rush 07:30–09:00, mid-morning class break ~10:00, lunch peak 12:00–13:30
 *  - Today only contains sales up to 10:00, with the last few still pending
 */

const DAYS_BACK = 70;
const VAT_RATE = 0.15;

// ---------- seeded random ----------
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261110);
const chance = (p: number) => rand() < p;
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
function weightedPick<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = rand() * total;
  for (const i of items) {
    r -= i.weight;
    if (r <= 0) return i.value;
  }
  return items[items.length - 1].value;
}

// ---------- menu helpers ----------
const byId = (id: string) => MENU.find((m) => m.id === id)!;
const BREAKFAST = ["avo-egg-toast", "breakfast-croissant", "granola-cups"];
const LUNCH = ["cajun-chicken-wrap", "cajun-beef-wrap", "grilled-chicken-salad", "triple-cheese"];
const HOT_DRINKS = ["cappuccino", "latte", "americano", "espresso", "mocha", "five-roses", "rooibos"];
const COLD_DRINKS = ["soft-drinks", "glow-up", "strawnana"];

const mainFor = (hour: number): MenuItem => {
  const morning = hour < 11;
  return byId(
    weightedPick([
      ...BREAKFAST.map((id) => ({ value: id, weight: morning ? 3 : 0.6 })),
      ...LUNCH.map((id) => ({ value: id, weight: morning ? 0.5 : 2.4 })),
    ]),
  );
};

const drinkFor = (hour: number): MenuItem => {
  const morning = hour < 11;
  return byId(
    weightedPick([
      { value: "cappuccino", weight: morning ? 4 : 1.6 },
      { value: "latte", weight: morning ? 3.2 : 1.4 },
      { value: "americano", weight: morning ? 2 : 0.8 },
      { value: "espresso", weight: morning ? 1.4 : 0.6 },
      { value: "mocha", weight: 1 },
      { value: "five-roses", weight: 0.8 },
      { value: "rooibos", weight: 1 },
      ...COLD_DRINKS.map((id) => ({ value: id, weight: morning ? 0.6 : 1.8 })),
    ]),
  );
};

const addOnFor = (main: MenuItem | null, drink: MenuItem | null): MenuItem | null => {
  if (drink && HOT_DRINKS.includes(drink.id) && chance(0.08)) return byId("oat-milk");
  if (!main) return null;
  if (!chance(0.28)) return null;
  if (main.id === "avo-egg-toast") return byId(pick(["bacon", "extra-egg"]));
  if (main.id === "breakfast-croissant") return byId(pick(["avocado", "extra-egg"]));
  if (main.id === "grilled-chicken-salad") return byId("avocado");
  if (main.id === "triple-cheese") return byId(pick(["bacon", "fries"]));
  if (main.id.startsWith("cajun")) return byId(pick(["fries", "avocado"]));
  return null;
};

// ---------- trading pattern ----------
// Relative demand per 15-minute slot, by hour
const HOUR_WEIGHT: Record<number, number> = {
  7: 0.7, 8: 1.35, 9: 0.9, 10: 1.25, 11: 0.75, 12: 1.6, 13: 1.3, 14: 0.65, 15: 0.45,
};
const SATURDAY_HOURS = [8, 9, 10, 11, 12];

const DECLINE_REASONS = [
  { value: "Insufficient funds", weight: 5 },
  { value: "Do not honour", weight: 2 },
  { value: "Card expired", weight: 1 },
  { value: "Incorrect PIN", weight: 2 },
  { value: "Contactless limit exceeded", weight: 1 },
];

const CANCEL_REASONS = [
  { value: "Customer cancelled at terminal", weight: 4 },
  { value: "Cashier voided order", weight: 3 },
  { value: "Card tap timed out", weight: 2 },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

function buildBasket(hour: number): CartItem[] {
  const main = chance(hour < 11 ? 0.62 : 0.8) ? mainFor(hour) : null;
  let drink = chance(main ? 0.7 : 1) ? drinkFor(hour) : null;
  if (!main && !drink) drink = drinkFor(hour);
  const addOn = addOnFor(main, drink);

  const lines: CartItem[] = [];
  const groupOrder = chance(0.1); // someone buying for a friend
  const push = (m: MenuItem | null) => {
    if (!m) return;
    lines.push({
      id: m.id,
      name: m.name,
      price: m.price,
      category: m.category,
      quantity: groupOrder && m.category !== "Add-ons" ? 2 : 1,
    });
  };
  push(main);
  push(drink);
  push(addOn);
  return lines;
}

function generate(): Transaction[] {
  const out: Transaction[] = [];
  const today = startOfDay(DEMO_NOW);
  let id = 1;

  for (let d = DAYS_BACK; d >= 0; d--) {
    const day = addDays(today, -d);
    const dow = day.getDay(); // 0 Sun … 6 Sat
    if (dow === 0) continue;

    const isSaturday = dow === 6;
    const hours = isSaturday ? SATURDAY_HOURS : Object.keys(HOUR_WEIGHT).map(Number);
    // Gentle upward trend as the term progresses, quieter on Mondays and Fridays
    const trend = 0.88 + ((DAYS_BACK - d) / DAYS_BACK) * 0.18;
    const dayFactor = (isSaturday ? 0.3 : dow === 1 ? 0.92 : dow === 5 ? 0.9 : 1) * (d === 0 ? 1.12 : 1); // busy morning today
    let seq = 1;

    const dayTx: Transaction[] = [];
    for (const campus of CAMPUSES) {
      for (const hour of hours) {
        for (let slot = 0; slot < 4; slot++) {
          const expected = 1.15 * campus.weight * HOUR_WEIGHT[hour] * trend * dayFactor;
          // up to 2 sales per 15-minute slot
          let n = Math.floor(expected) + (chance(expected - Math.floor(expected)) ? 1 : 0);
          if (chance(0.15)) n = Math.max(0, n - 1);
          for (let k = 0; k < n; k++) {
            const minute = slot * 15 + Math.floor(rand() * 15);
            const second = Math.floor(rand() * 60);
            const ts = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, second);
            if (ts >= DEMO_NOW) continue;

            const cartItems = buildBasket(hour);
            const total = round2(cartItems.reduce((s, i) => s + i.price * i.quantity, 0));
            const tax = round2((total * VAT_RATE) / (1 + VAT_RATE));
            const minutesAgo = (DEMO_NOW.getTime() - ts.getTime()) / 60000;

            let paymentStatus: PaymentStatus = "approved";
            if (minutesAgo < 6 && chance(0.6)) paymentStatus = "pending";
            else if (chance(0.055)) paymentStatus = "declined";
            else if (chance(0.025)) paymentStatus = "cancelled";

            const paymentMethod: PaymentMethod = chance(0.64) ? "debit" : "credit";

            dayTx.push({
              id: "",
              transactionNumber: "",
              timestamp: ts,
              terminalId: campus.terminal,
              campus: campus.name,
              cashier: pick(campus.cashiers),
              cartItems,
              subtotal: round2(total - tax),
              tax,
              total,
              paymentMethod,
              paymentStatus,
              cardLastFour: String(1000 + Math.floor(rand() * 9000)),
              declineReason: paymentStatus === "declined" ? weightedPick(DECLINE_REASONS) : undefined,
              cancelReason: paymentStatus === "cancelled" ? weightedPick(CANCEL_REASONS) : undefined,
            });
          }
        }
      }
    }

    dayTx
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .forEach((t) => {
        t.id = String(id++);
        t.transactionNumber = `TXN-${format(day, "yyMMdd")}-${String(seq++).padStart(4, "0")}`;
        out.push(t);
      });
  }

  // Newest first
  out.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  // The very latest sales are still being authorised
  out.slice(0, 2).forEach((t) => {
    t.paymentStatus = "pending";
    t.declineReason = undefined;
    t.cancelReason = undefined;
  });
  // Make sure today shows a cancelled sale for the demo
  const todayKey = format(DEMO_NOW, "yyyy-MM-dd");
  const cancelToday = out.find((t, i) => i > 6 && format(t.timestamp, "yyyy-MM-dd") === todayKey && t.paymentStatus === "approved");
  if (cancelToday) {
    cancelToday.paymentStatus = "cancelled";
    cancelToday.cancelReason = "Customer cancelled at terminal";
  }
  return out;
}

export const mockTransactions: Transaction[] = generate();
