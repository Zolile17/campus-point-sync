import { addDays, endOfDay, format, startOfDay } from "date-fns";

/**
 * The "current time" for the demo. All mock data is generated relative to this
 * moment, and "Today" / "Yesterday" filters are resolved against it.
 *
 * Tuesday 10 November 2026, 10:00 (local time).
 * To make the demo follow the real clock instead, use: `new Date()`.
 */
export const DEMO_NOW = new Date(2026, 10, 10, 10, 0, 0);

export const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

export type DatePreset = "today" | "yesterday" | "7d" | "30d" | "all" | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

/** Resolve a preset to an inclusive date range, or null for "all". */
export function resolvePreset(preset: DatePreset, custom?: Partial<DateRange>): DateRange | null {
  const today = startOfDay(DEMO_NOW);
  switch (preset) {
    case "today":
      return { from: today, to: endOfDay(today) };
    case "yesterday": {
      const y = addDays(today, -1);
      return { from: y, to: endOfDay(y) };
    }
    case "7d":
      return { from: addDays(today, -6), to: endOfDay(today) };
    case "30d":
      return { from: addDays(today, -29), to: endOfDay(today) };
    case "custom":
      if (custom?.from && custom?.to) {
        return { from: startOfDay(custom.from), to: endOfDay(custom.to) };
      }
      return null;
    default:
      return null;
  }
}

export const presetLabel: Record<DatePreset, string> = {
  today: "Today",
  yesterday: "Yesterday",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All time",
  custom: "Custom range",
};

export const formatRand = (n: number, decimals = 2) =>
  `R${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

export const formatRandCompact = (n: number) => {
  if (Math.abs(n) >= 1000) {
    return `R${(n / 1000).toLocaleString("en-US", { maximumFractionDigits: 1 })}k`;
  }
  return `R${Math.round(n).toLocaleString("en-US")}`;
};
