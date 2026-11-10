import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { useId } from "react";
import { cn } from "@/lib/utils";

export type StatTone = "brand" | "info" | "success" | "warning" | "neutral" | "teal";

interface StatsCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Percentage change vs. the comparison period; null hides the chip */
  trend?: number | null;
  /** When true, a decrease is the good direction (e.g. declines) */
  invertTrend?: boolean;
  /** Unit shown after the trend value (default %) */
  trendUnit?: string;
  /** Colour of the icon chip and sparkline */
  tone?: StatTone;
  /** Dark, high-emphasis card for the headline number */
  hero?: boolean;
  /** Small trend line under the value */
  sparkline?: number[];
  /** @deprecated use tone="brand" */
  accent?: boolean;
}

const toneStyles: Record<StatTone, { chip: string; stroke: string; bar: string }> = {
  brand: { chip: "bg-brand/10 text-brand", stroke: "hsl(var(--brand))", bar: "bg-brand" },
  info: { chip: "bg-info/10 text-info", stroke: "hsl(var(--info))", bar: "bg-info" },
  success: { chip: "bg-success/10 text-success", stroke: "hsl(var(--success))", bar: "bg-success" },
  warning: { chip: "bg-warning/10 text-warning", stroke: "hsl(var(--warning))", bar: "bg-warning" },
  teal: { chip: "bg-chart-4/10 text-chart-4", stroke: "hsl(var(--chart-4))", bar: "bg-chart-4" },
  neutral: { chip: "bg-muted text-foreground/70", stroke: "hsl(var(--muted-foreground))", bar: "bg-foreground/40" },
};

const Sparkline = ({ data, stroke, light }: { data: number[]; stroke: string; light?: boolean }) => {
  const id = useId().replace(/:/g, "");
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={light ? 0.55 : 0.28} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} fill={`url(#spark-${id})`} isAnimationActive={false} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUnit = "%",
  invertTrend,
  tone,
  hero,
  sparkline,
  accent,
}: StatsCardProps) => {
  const t = toneStyles[tone ?? (accent ? "brand" : "neutral")];
  const hasTrend = trend !== undefined && trend !== null && Number.isFinite(trend);
  const up = hasTrend && trend! >= 0;
  const good = invertTrend ? !up : up;

  if (hero) {
    return (
      <div
        className="relative overflow-hidden rounded-xl p-5 text-white shadow-[0_8px_24px_-12px_rgba(212,35,48,0.55)]"
        style={{
          background:
            "radial-gradient(120% 140% at 100% 0%, hsl(356 80% 45% / 0.55) 0%, transparent 55%), linear-gradient(160deg, #1a1a1e 0%, #0e0e10 100%)",
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-white/70">{title}</p>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-inset ring-white/15">
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="tabular mt-3 text-[1.85rem] font-semibold leading-none tracking-tight">{value}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          {hasTrend && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular",
                good ? "bg-emerald-400/15 text-emerald-300" : "bg-red-400/15 text-red-300",
              )}
            >
              {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend!).toFixed(1)}
              {trendUnit}
            </span>
          )}
          {description && <span className="text-white/60">{description}</span>}
        </div>
        {sparkline && sparkline.length > 1 && (
          <div className="-mx-1 mt-3">
            <Sparkline data={sparkline} stroke="hsl(356 85% 62%)" light />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="surface group relative overflow-hidden p-5 transition-shadow hover:shadow-md">
      <div className={cn("absolute inset-x-0 top-0 h-[3px] opacity-80", t.bar)} />
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", t.chip)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="tabular mt-3 text-[1.75rem] font-semibold leading-none tracking-tight">{value}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {hasTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium tabular",
              good ? "bg-success/10 text-success" : "bg-brand/10 text-brand",
            )}
          >
            {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend!).toFixed(1)}
            {trendUnit}
          </span>
        )}
        {description && <span className="text-muted-foreground">{description}</span>}
      </div>
      {sparkline && sparkline.length > 1 && (
        <div className="-mx-1 mt-3">
          <Sparkline data={sparkline} stroke={t.stroke} />
        </div>
      )}
    </div>
  );
};
