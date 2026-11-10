import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  ArrowDown, ArrowUp, ArrowUpDown, Banknote, CalendarDays, Coffee, CreditCard, Package, Plus, Receipt,
  ShoppingBasket, Trophy, UtensilsCrossed,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CAMPUS_COLOR, CATEGORY_COLOR, ChartTooltip, GRID, Legend, SERIES, axisProps } from "@/components/shared/chart";
import { mockTransactions } from "@/data/mockTransactions";
import { CAMPUSES, CATEGORIES } from "@/data/menu";
import { ItemCategory } from "@/types/transaction";
import { DEMO_NOW, DatePreset, dayKey, formatRand, formatRandCompact, presetLabel, resolvePreset } from "@/lib/demoClock";
import { approved, inRange, summarise } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type SortField = "name" | "quantity" | "revenue" | "price";
type RangePreset = Extract<DatePreset, "7d" | "30d" | "all">;

const categoryIcon = (c: string) =>
  c === "All Day Menu" ? <UtensilsCrossed className="h-3.5 w-3.5" /> : c === "Beverages" ? <Coffee className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />;

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Segmented = ({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) => (
  <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
    {options.map((o) => (
      <button
        key={o.value}
        onClick={() => onChange(o.value)}
        className={cn(
          "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          value === o.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
        )}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const HBar = ({ label, value, max, color, display, sub }: { label: string; value: number; max: number; color: string; display: string; sub?: string }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 font-medium">
        <span className="h-2 w-2 rounded-sm" style={{ background: color }} />
        {label}
      </span>
      <span className="tabular font-semibold">
        {display}
        {sub && <span className="ml-1.5 text-xs font-normal text-muted-foreground">{sub}</span>}
      </span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full" style={{ width: `${(value / Math.max(max, 1)) * 100}%`, background: color }} />
    </div>
  </div>
);

const Metrics = () => {
  const [range, setRange] = useState<RangePreset>("30d");
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | "all">("all");
  const [sortField, setSortField] = useState<SortField>("revenue");
  const [sortAsc, setSortAsc] = useState(false);

  const a = useMemo(() => {
    const r = resolvePreset(range);
    const txs = mockTransactions.filter((t) => inRange(t, r));
    const ok = approved(txs);
    const summary = summarise(txs);
    const vat = ok.reduce((s, t) => s + t.tax, 0);

    // Daily revenue (chronological)
    const byDay = new Map<string, { revenue: number; count: number; date: Date }>();
    ok.forEach((t) => {
      const k = dayKey(t.timestamp);
      const d = byDay.get(k) ?? { revenue: 0, count: 0, date: t.timestamp };
      d.revenue += t.total;
      d.count += 1;
      byDay.set(k, d);
    });
    const daily = [...byDay.entries()]
      .sort(([x], [y]) => x.localeCompare(y))
      .map(([k, d]) => ({
        key: k,
        label: format(d.date, "d MMM"),
        tooltip: format(d.date, "EEE d MMM") + (k === dayKey(DEMO_NOW) ? " (so far)" : ""),
        revenue: Math.round(d.revenue),
      }));
    const fullDays = daily.filter((d) => d.key !== dayKey(DEMO_NOW));
    const avgDaily = fullDays.length ? fullDays.reduce((s, d) => s + d.revenue, 0) / fullDays.length : 0;

    // Items
    const items = new Map<string, { name: string; category: ItemCategory; price: number; quantity: number; revenue: number; orders: number }>();
    ok.forEach((t) =>
      t.cartItems.forEach((i) => {
        const e = items.get(i.name) ?? { name: i.name, category: i.category, price: i.price, quantity: 0, revenue: 0, orders: 0 };
        e.quantity += i.quantity;
        e.revenue += i.quantity * i.price;
        e.orders += 1;
        items.set(i.name, e);
      }),
    );
    const itemList = [...items.values()];
    const itemRevenue = itemList.reduce((s, i) => s + i.revenue, 0);

    const categories = CATEGORIES.map((c) => {
      const list = itemList.filter((i) => i.category === c);
      return {
        name: c,
        revenue: list.reduce((s, i) => s + i.revenue, 0),
        units: list.reduce((s, i) => s + i.quantity, 0),
        best: [...list].sort((x, y) => y.quantity - x.quantity)[0],
      };
    });

    const campuses = CAMPUSES.map((c) => {
      const s = summarise(txs.filter((t) => t.campus === c.name));
      return { name: c.name, terminal: c.terminal, ...s };
    });

    // Peak hours — average transactions per trading day
    const tradingDays = Math.max(1, byDay.size);
    const hours = [7, 8, 9, 10, 11, 12, 13, 14, 15].map((h) => ({
      hour: `${String(h).padStart(2, "0")}:00`,
      avg: +(ok.filter((t) => t.timestamp.getHours() === h).length / tradingDays).toFixed(1),
    }));
    const peak = hours.reduce((m, h) => (h.avg > m.avg ? h : m), hours[0]);

    // Weekday — average revenue per trading day of that weekday
    const weekday = WEEKDAYS.map((label, idx) => {
      const dow = idx + 1;
      const days = fullDays.filter((d) => byDay.get(d.key)!.date.getDay() === dow);
      return { day: label, avg: days.length ? Math.round(days.reduce((s, d) => s + d.revenue, 0) / days.length) : 0 };
    });

    const debit = ok.filter((t) => t.paymentMethod === "debit");
    const credit = ok.filter((t) => t.paymentMethod === "credit");

    const declines = new Map<string, number>();
    txs.filter((t) => t.paymentStatus === "declined").forEach((t) => declines.set(t.declineReason!, (declines.get(t.declineReason!) ?? 0) + 1));
    const declineReasons = [...declines.entries()].sort((x, y) => y[1] - x[1]);

    return { summary, vat, daily, avgDaily, itemList, itemRevenue, categories, campuses, hours, peak, weekday, debit, credit, declineReasons };
  }, [range]);

  const sortedItems = useMemo(() => {
    const m = sortAsc ? 1 : -1;
    return [...a.itemList].sort((x, y) => {
      switch (sortField) {
        case "name": return m * x.name.localeCompare(y.name);
        case "quantity": return m * (x.quantity - y.quantity);
        case "price": return m * (x.price - y.price);
        default: return m * (x.revenue - y.revenue);
      }
    });
  }, [a.itemList, sortField, sortAsc]);

  const topItems = useMemo(
    () =>
      [...a.itemList]
        .filter((i) => categoryFilter === "all" || i.category === categoryFilter)
        .sort((x, y) => y.quantity - x.quantity)
        .slice(0, 8)
        .map((i) => ({ ...i, short: i.name.replace(" with Fries/Side Salad", "").replace(" with Fries", "") })),
    [a.itemList, categoryFilter],
  );

  const sortBy = (f: SortField) => {
    if (sortField === f) setSortAsc(!sortAsc);
    else {
      setSortField(f);
      setSortAsc(f === "name");
    }
  };
  const SortIcon = ({ f }: { f: SortField }) =>
    sortField !== f ? <ArrowUpDown className="h-3.5 w-3.5 opacity-40" /> : sortAsc ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;

  const topCampus = [...a.campuses].sort((x, y) => y.revenue - x.revenue)[0];
  const bestSeller = [...a.itemList].sort((x, y) => y.quantity - x.quantity)[0];
  const maxCampusRevenue = Math.max(...a.campuses.map((c) => c.revenue));
  const maxCategoryRevenue = Math.max(...a.categories.map((c) => c.revenue));
  const okCount = a.debit.length + a.credit.length;
  const debitShare = okCount ? (a.debit.length / okCount) * 100 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Metrics & Analytics"
        description="Payments, volume and menu performance across all campuses"
        actions={
          <Segmented
            value={range}
            onChange={(v) => setRange(v as RangePreset)}
            options={(["7d", "30d", "all"] as RangePreset[]).map((v) => ({ value: v, label: presetLabel[v] }))}
          />
        }
      />

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="h-10 w-full justify-start gap-1 rounded-none border-b border-border bg-transparent p-0">
          {[
            { v: "revenue", label: "Payments", Icon: Banknote },
            { v: "volume", label: "Volume", Icon: Receipt },
            { v: "products", label: "Products", Icon: Package },
          ].map(({ v, label, Icon }) => (
            <TabsTrigger
              key={v}
              value={v}
              className="relative h-10 gap-2 rounded-none border-b-2 border-transparent bg-transparent px-3 text-muted-foreground shadow-none data-[state=active]:border-brand data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Icon className="h-4 w-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ---------------- Revenue ---------------- */}
        <TabsContent value="revenue" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard hero title="Approved payments" value={formatRand(a.summary.revenue)} icon={Banknote} description={presetLabel[range]} sparkline={a.daily.filter((d) => d.key !== dayKey(DEMO_NOW) && parseISO(d.key).getDay() !== 6).map((d) => d.revenue)} />
            <StatsCard tone="info" title="Average per trading day" value={formatRand(a.avgDaily)} icon={CalendarDays} description="Excludes today" />
            <StatsCard tone="warning" title="Top campus" value={topCampus?.name ?? "—"} icon={Trophy} description={topCampus ? `${formatRand(topCampus.revenue, 0)} · ${((topCampus.revenue / Math.max(a.summary.revenue, 1)) * 100).toFixed(0)}% of payments` : ""} />
            <StatsCard tone="teal" title="VAT collected" value={formatRand(a.vat)} icon={Receipt} description="15% included in prices" />
          </div>

          <Panel title="Daily payments" description="Approved card payments per trading day · Saturdays are half-days, closed Sundays · today is partial">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={a.daily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="22%">
                  <CartesianGrid vertical={false} stroke={GRID} />
                  <XAxis dataKey="label" {...axisProps} minTickGap={24} />
                  <YAxis {...axisProps} width={56} tickFormatter={formatRandCompact} />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.6 }}
                    content={({ payload, ...rest }) => (
                      <ChartTooltip {...rest} payload={payload} label={payload?.[0]?.payload?.tooltip} formatter={(v) => formatRand(v, 0)} />
                    )}
                  />
                  <Bar dataKey="revenue" name="Payments" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {a.daily.map((d) => (
                      <Cell key={d.key} fill={SERIES[0]} fillOpacity={d.key === dayKey(DEMO_NOW) ? 0.45 : 1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Payments by campus" description="Approved payments and share of total" bodyClassName="p-5 space-y-5">
              {[...a.campuses].sort((x, y) => y.revenue - x.revenue).map((c) => (
                <HBar
                  key={c.name}
                  label={c.name}
                  value={c.revenue}
                  max={maxCampusRevenue}
                  color={CAMPUS_COLOR[c.name]}
                  display={formatRand(c.revenue, 0)}
                  sub={`${((c.revenue / Math.max(a.summary.revenue, 1)) * 100).toFixed(1)}%`}
                />
              ))}
            </Panel>
            <Panel title="Payments by category" description="Item-level sales across the menu" bodyClassName="p-5 space-y-5">
              {a.categories.map((c) => (
                <HBar
                  key={c.name}
                  label={c.name}
                  value={c.revenue}
                  max={maxCategoryRevenue}
                  color={CATEGORY_COLOR[c.name]}
                  display={formatRand(c.revenue, 0)}
                  sub={`${c.units.toLocaleString("en-US")} units`}
                />
              ))}
            </Panel>
          </div>
        </TabsContent>

        {/* ---------------- Volume ---------------- */}
        <TabsContent value="volume" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard tone="brand" title="Transactions" value={a.summary.count.toLocaleString("en-US")} icon={Receipt} description={`${a.summary.items.toLocaleString("en-US")} items sold`} />
            <StatsCard tone="success" title="Approval rate" value={`${a.summary.approvalRate.toFixed(1)}%`} icon={CreditCard} description={`${a.summary.declined} declined · ${a.summary.cancelled} cancelled`} />
            <StatsCard tone="warning" title="Busiest hour" value={a.peak.hour} icon={CalendarDays} description={`${a.peak.avg} sales per day on average`} />
            <StatsCard tone="info" title="Debit share" value={`${debitShare.toFixed(0)}%`} icon={CreditCard} description={`${a.debit.length.toLocaleString("en-US")} debit · ${a.credit.length.toLocaleString("en-US")} credit`} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Peak hours" description="Average approved sales per trading day, by hour · busiest hour highlighted">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={a.hours} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} barCategoryGap="24%">
                    <CartesianGrid vertical={false} stroke={GRID} />
                    <XAxis dataKey="hour" {...axisProps} />
                    <YAxis {...axisProps} width={44} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.6 }} content={<ChartTooltip formatter={(v) => `${v} / day`} />} />
                    <Bar dataKey="avg" name="Sales" radius={[4, 4, 0, 0]} maxBarSize={34}>
                      {a.hours.map((h) => (
                        <Cell key={h.hour} fill={SERIES[0]} fillOpacity={h.hour === a.peak.hour ? 1 : 0.45} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
            <Panel title="Payments by weekday" description="Average approved payments per trading day">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={a.weekday} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="28%">
                    <CartesianGrid vertical={false} stroke={GRID} />
                    <XAxis dataKey="day" {...axisProps} />
                    <YAxis {...axisProps} width={56} tickFormatter={formatRandCompact} />
                    <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.6 }} content={<ChartTooltip formatter={(v) => formatRand(v, 0)} />} />
                    <Bar dataKey="avg" name="Avg payments" fill={SERIES[0]} radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Panel className="lg:col-span-2" title="Terminal performance" description="One terminal per campus" bodyClassName="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Terminal</th>
                    <th className="px-3 py-2.5 text-right font-medium">Transactions</th>
                    <th className="px-3 py-2.5 text-right font-medium">Payments</th>
                    <th className="px-3 py-2.5 text-right font-medium">Avg basket</th>
                    <th className="px-5 py-2.5 text-right font-medium">Approval</th>
                  </tr>
                </thead>
                <tbody>
                  {a.campuses.map((c) => (
                    <tr key={c.terminal} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-mono text-[13px] font-medium">{c.terminal}</p>
                        <p className="text-xs text-muted-foreground">{c.name}</p>
                      </td>
                      <td className="tabular px-3 py-3 text-right">{c.count.toLocaleString("en-US")}</td>
                      <td className="tabular px-3 py-3 text-right font-semibold">{formatRand(c.revenue, 0)}</td>
                      <td className="tabular px-3 py-3 text-right">{formatRand(c.avgBasket)}</td>
                      <td className="tabular px-5 py-3 text-right">{c.approvalRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
            <Panel title="Decline reasons" description={`${a.summary.declined} declined payments`} bodyClassName="p-5 space-y-4">
              {a.declineReasons.length === 0 ? (
                <p className="text-sm text-muted-foreground">No declines in this period.</p>
              ) : (
                a.declineReasons.map(([reason, n]) => (
                  <HBar key={reason} label={reason} value={n} max={a.declineReasons[0][1]} color="hsl(var(--muted-foreground))" display={String(n)} />
                ))
              )}
            </Panel>
          </div>
        </TabsContent>

        {/* ---------------- Products ---------------- */}
        <TabsContent value="products" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatsCard tone="info" title="Menu items sold" value={String(a.itemList.length)} icon={Package} description="distinct items" />
            <StatsCard tone="teal" title="Units sold" value={a.itemList.reduce((s, i) => s + i.quantity, 0).toLocaleString("en-US")} icon={ShoppingBasket} description={presetLabel[range]} />
            <StatsCard tone="success" title="Item sales" value={formatRand(a.itemRevenue)} icon={Banknote} description="approved orders" />
            <StatsCard tone="brand" title="Best seller" value={bestSeller?.name.replace(" with Fries/Side Salad", "") ?? "—"} icon={Trophy} description={`${bestSeller?.quantity.toLocaleString("en-US") ?? 0} sold`} />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {a.categories.map((c) => (
              <div key={c.name} className="surface p-5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-sm" style={{ background: CATEGORY_COLOR[c.name] }} />
                  {c.name} · top seller
                </div>
                <p className="mt-2 text-lg font-semibold leading-snug">{c.best?.name ?? "—"}</p>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground tabular">{c.best?.quantity.toLocaleString("en-US")} sold</span>
                  <span className="tabular font-semibold">{c.best ? formatRand(c.best.revenue, 0) : ""}</span>
                </div>
              </div>
            ))}
          </div>

          <Panel
            title="Most popular items"
            description="Top 8 by units sold"
            actions={
              <Segmented
                value={categoryFilter}
                onChange={(v) => setCategoryFilter(v as ItemCategory | "all")}
                options={[
                  { value: "all", label: "All" },
                  { value: "All Day Menu", label: "Food" },
                  { value: "Beverages", label: "Drinks" },
                  { value: "Add-ons", label: "Add-ons" },
                ]}
              />
            }
          >
            {categoryFilter === "all" && (
              <div className="mb-4">
                <Legend items={CATEGORIES.map((c) => ({ label: c, color: CATEGORY_COLOR[c] }))} />
              </div>
            )}
            <div style={{ height: Math.max(160, topItems.length * 40) }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topItems} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }} barCategoryGap="22%">
                  <CartesianGrid horizontal={false} stroke={GRID} />
                  <XAxis type="number" {...axisProps} />
                  <YAxis type="category" dataKey="short" {...axisProps} width={170} tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.6 }} content={<ChartTooltip formatter={(v) => `${v.toLocaleString("en-US")} sold`} />} />
                  <Bar dataKey="quantity" name="Units" radius={[0, 4, 4, 0]} maxBarSize={22} isAnimationActive={false}>
                    {topItems.map((i) => (
                      <Cell key={i.name} fill={CATEGORY_COLOR[i.category]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Product performance" description="Every item sold, for stock and menu planning" bodyClassName="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  {([
                    ["name", "Item", "text-left pl-5"],
                    [null, "Category", "text-left"],
                    ["quantity", "Units", "text-right"],
                    ["revenue", "Sales", "text-right"],
                    ["price", "Price", "text-right"],
                    [null, "Share", "text-right"],
                    [null, "Orders", "text-right pr-5"],
                  ] as [SortField | null, string, string][]).map(([f, label, cls]) => (
                    <th key={label} className={cn("px-3 py-2.5 font-medium", cls)}>
                      {f ? (
                        <button onClick={() => sortBy(f)} className={cn("inline-flex items-center gap-1 uppercase hover:text-foreground", sortField === f && "text-foreground")}>
                          {label} <SortIcon f={f} />
                        </button>
                      ) : (
                        label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((i) => {
                  const share = (i.revenue / Math.max(a.itemRevenue, 1)) * 100;
                  return (
                    <tr key={i.name} className="border-b border-border transition-colors last:border-0 hover:bg-muted/40">
                      <td className="py-3 pl-5 pr-3 font-medium">{i.name}</td>
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs text-muted-foreground">
                          <span style={{ color: CATEGORY_COLOR[i.category] }}>{categoryIcon(i.category)}</span>
                          {i.category}
                        </span>
                      </td>
                      <td className="tabular px-3 py-3 text-right">{i.quantity.toLocaleString("en-US")}</td>
                      <td className="tabular px-3 py-3 text-right font-semibold">{formatRand(i.revenue, 0)}</td>
                      <td className="tabular px-3 py-3 text-right text-muted-foreground">{formatRand(i.price, 0)}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-foreground/70" style={{ width: `${Math.min(share * 4, 100)}%` }} />
                          </div>
                          <span className="tabular w-11 text-right text-xs">{share.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="tabular py-3 pl-3 pr-5 text-right text-muted-foreground">{i.orders.toLocaleString("en-US")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Metrics;
