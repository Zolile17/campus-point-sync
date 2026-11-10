import { useMemo, useState } from "react";
import { addDays, format, parseISO, startOfDay } from "date-fns";
import { Ban, Banknote, CheckCircle2, Receipt, XCircle } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DEFAULT_FILTERS, FilterState, TransactionFilters } from "@/components/dashboard/TransactionFilters";
import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { mockTransactions } from "@/data/mockTransactions";
import { exportToCSV } from "@/utils/csvExport";
import { DEMO_NOW, DateRange, dayKey, formatRand, presetLabel, resolvePreset } from "@/lib/demoClock";
import { inRange, pctChange, summarise } from "@/lib/analytics";
import { Transaction } from "@/types/transaction";

/** The equivalent earlier period to compare the selected range against. */
function comparisonFor(filters: FilterState): { range: DateRange; label: string } | null {
  const today = startOfDay(DEMO_NOW);
  switch (filters.date) {
    case "today":
      return {
        range: { from: addDays(today, -7), to: addDays(DEMO_NOW, -7) },
        label: `vs last ${format(DEMO_NOW, "EEE")} by ${format(DEMO_NOW, "HH:mm")}`,
      };
    case "yesterday":
      return {
        range: { from: addDays(today, -8), to: addDays(today, -7) },
        label: `vs ${format(addDays(today, -8), "EEE d MMM")}`,
      };
    case "7d":
      return { range: { from: addDays(today, -13), to: addDays(today, -6) }, label: "vs previous 7 days" };
    case "30d":
      return { range: { from: addDays(today, -59), to: addDays(today, -29) }, label: "vs previous 30 days" };
    default:
      return null;
  }
}

const Index = () => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const range = useMemo(
    () =>
      resolvePreset(filters.date, {
        from: filters.customFrom ? parseISO(filters.customFrom) : undefined,
        to: filters.customTo ? parseISO(filters.customTo) : undefined,
      }),
    [filters.date, filters.customFrom, filters.customTo],
  );

  // Campus + payment method apply to the stats cards; status and search only narrow the table.
  const scope = (t: Transaction) =>
    (filters.campus === "all" || t.campus === filters.campus) &&
    (filters.method === "all" || t.paymentMethod === filters.method);

  const stats = useMemo(() => {
    const current = summarise(mockTransactions.filter((t) => scope(t) && inRange(t, range)));
    const cmp = comparisonFor(filters);
    const previous = cmp
      ? summarise(mockTransactions.filter((t) => scope(t) && t.timestamp >= cmp.range.from && t.timestamp < cmp.range.to))
      : null;
    return { current, previous, cmpLabel: cmp?.label };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, filters.campus, filters.method, filters.date]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return mockTransactions.filter((t) => {
      if (!scope(t) || !inRange(t, range)) return false;
      if (filters.status !== "all" && t.paymentStatus !== filters.status) return false;
      if (q) {
        const hay = `${t.transactionNumber} ${t.terminalId} ${t.cashier} ${t.cartItems.map((i) => i.name).join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, range]);

  // Daily series for the card sparklines — last 14 full weekdays (Saturday half-days and today's partial day would read as dips)
  const spark = useMemo(() => {
    const out = { revenue: [] as number[], avg: [] as number[], approved: [] as number[], declined: [] as number[], cancelled: [] as number[] };
    const today = startOfDay(DEMO_NOW);
    const days: Date[] = [];
    for (let i = 1; days.length < 14; i++) {
      const d = addDays(today, -i);
      if (d.getDay() !== 0 && d.getDay() !== 6) days.unshift(d);
    }
    for (const d of days) {
      const next = addDays(d, 1);
      const s = summarise(mockTransactions.filter((t) => scope(t) && t.timestamp >= d && t.timestamp < next));
      out.revenue.push(s.revenue);
      out.avg.push(s.avgBasket);
      out.approved.push(s.approved);
      out.declined.push(s.declined);
      out.cancelled.push(s.cancelled);
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.campus, filters.method]);

  const { current: c, previous: p, cmpLabel } = stats;
  const trend = (now: number, before: number | undefined) => (p && before !== undefined ? pctChange(now, before) : null);
  const successRate = c.count ? (c.approved / c.count) * 100 : 0;
  const declineRate = c.count ? (c.declined / c.count) * 100 : 0;
  const cancelRate = c.count ? (c.cancelled / c.count) * 100 : 0;

  const periodLabel =
    filters.date === "today"
      ? `Today so far · ${format(DEMO_NOW, "HH:mm")}`
      : filters.date === "custom" && range
        ? `${format(range.from, "d MMM")} – ${format(range.to, "d MMM yyyy")}`
        : presetLabel[filters.date];

  const minDate = dayKey(mockTransactions[mockTransactions.length - 1].timestamp);
  const maxDate = dayKey(DEMO_NOW);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={format(DEMO_NOW, "EEEE, d MMMM yyyy")}
        title="Transaction Dashboard"
        description="Card payments across all Capsicum campus delis"
        actions={
          <span className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
            Showing <span className="text-foreground">{periodLabel}</span>
            {filters.campus !== "all" && <> · <span className="text-foreground">{filters.campus}</span></>}
          </span>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          hero
          title="Payments"
          value={formatRand(c.revenue)}
          icon={Banknote}
          trend={trend(c.revenue, p?.revenue)}
          description={cmpLabel ?? `${c.approved.toLocaleString("en-US")} approved`}
          sparkline={spark.revenue}
        />
        <StatsCard
          tone="info"
          title="Avg transaction"
          value={formatRand(c.avgBasket)}
          icon={Receipt}
          trend={trend(c.avgBasket, p?.avgBasket)}
          description="Per successful payment"
          sparkline={spark.avg}
        />
        <StatsCard
          tone="success"
          title="Successful"
          value={c.approved.toLocaleString("en-US")}
          icon={CheckCircle2}
          trend={trend(c.approved, p?.approved)}
          description={`${successRate.toFixed(1)}% success rate${c.pending ? ` · ${c.pending} pending` : ""}`}
          sparkline={spark.approved}
        />
        <StatsCard
          tone="brand"
          title="Declined"
          value={c.declined.toLocaleString("en-US")}
          icon={XCircle}
          trend={trend(c.declined, p?.declined)}
          invertTrend
          description={`${declineRate.toFixed(1)}% of attempts · ${formatRand(c.declinedValue, 0)}`}
          sparkline={spark.declined}
        />
        <StatsCard
          tone="warning"
          title="Cancelled"
          value={c.cancelled.toLocaleString("en-US")}
          icon={Ban}
          trend={trend(c.cancelled, p?.cancelled)}
          invertTrend
          description={`${cancelRate.toFixed(1)}% of attempts · ${formatRand(c.cancelledValue, 0)}`}
          sparkline={spark.cancelled}
        />
      </div>
      <p className="-mt-3 text-right text-[11px] text-muted-foreground">Trend lines show the last 14 weekdays</p>

      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold">Transactions</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Every card payment attempt from the campus terminals</p>
          </div>
          <p className="tabular text-xs text-muted-foreground">
            {filtered.length.toLocaleString("en-US")} of {c.count.toLocaleString("en-US")} transactions in this period
          </p>
        </div>
        <TransactionFilters
          value={filters}
          onChange={setFilters}
          onExport={() => exportToCSV(filtered)}
          minDate={minDate}
          maxDate={maxDate}
          filteredRecords={filtered.length}
        />
        <TransactionTable transactions={filtered} />
      </section>
    </div>
  );
};

export default Index;
