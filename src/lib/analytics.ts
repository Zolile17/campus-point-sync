import { addDays, startOfDay } from "date-fns";
import { Transaction } from "@/types/transaction";
import { DEMO_NOW, DateRange } from "@/lib/demoClock";

export const inRange = (t: Transaction, range: DateRange | null) =>
  !range || (t.timestamp >= range.from && t.timestamp <= range.to);

export const approved = (txs: Transaction[]) => txs.filter((t) => t.paymentStatus === "approved");

export const sumRevenue = (txs: Transaction[]) =>
  approved(txs).reduce((s, t) => s + t.total, 0);

export function summarise(txs: Transaction[]) {
  const ok = approved(txs);
  const revenue = ok.reduce((s, t) => s + t.total, 0);
  const declined = txs.filter((t) => t.paymentStatus === "declined").length;
  const pending = txs.filter((t) => t.paymentStatus === "pending").length;
  const cancelled = txs.filter((t) => t.paymentStatus === "cancelled").length;
  const pendingValue = txs.filter((t) => t.paymentStatus === "pending").reduce((s, t) => s + t.total, 0);
  const declinedValue = txs.filter((t) => t.paymentStatus === "declined").reduce((s, t) => s + t.total, 0);
  const cancelledValue = txs.filter((t) => t.paymentStatus === "cancelled").reduce((s, t) => s + t.total, 0);
  const settled = ok.length + declined;
  return {
    revenue,
    count: txs.length,
    approved: ok.length,
    declined,
    pending,
    cancelled,
    pendingValue,
    declinedValue,
    cancelledValue,
    approvalRate: settled ? (ok.length / settled) * 100 : 0,
    avgBasket: ok.length ? revenue / ok.length : 0,
    items: ok.reduce((s, t) => s + t.cartItems.reduce((a, i) => a + i.quantity, 0), 0),
  };
}

/** Percentage change, or null when there is no baseline. */
export const pctChange = (current: number, previous: number) =>
  previous ? ((current - previous) / previous) * 100 : null;

/** Transactions on a given day up to the same time-of-day as DEMO_NOW. */
export function sameTimeOnDay(txs: Transaction[], daysAgo: number) {
  const dayStart = addDays(startOfDay(DEMO_NOW), -daysAgo);
  const cutoff = addDays(DEMO_NOW, -daysAgo);
  return txs.filter((t) => t.timestamp >= dayStart && t.timestamp < cutoff);
}

export function windowDays(txs: Transaction[], fromDaysAgo: number, toDaysAgo: number) {
  const from = addDays(startOfDay(DEMO_NOW), -fromDaysAgo);
  const to = addDays(startOfDay(DEMO_NOW), -toDaysAgo + 1);
  return txs.filter((t) => t.timestamp >= from && t.timestamp < to);
}
