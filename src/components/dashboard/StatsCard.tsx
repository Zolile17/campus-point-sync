import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  /** Highlights the card with the brand accent */
  accent?: boolean;
}

export const StatsCard = ({ title, value, description, icon: Icon, trend, trendUnit = "%", invertTrend, accent }: StatsCardProps) => {
  const hasTrend = trend !== undefined && trend !== null && Number.isFinite(trend);
  const up = hasTrend && trend! >= 0;
  const good = invertTrend ? !up : up;

  return (
    <div className="surface relative overflow-hidden p-5">
      {accent && <div className="absolute inset-x-0 top-0 h-[3px] bg-brand" />}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg",
            accent ? "bg-brand-soft text-brand" : "bg-muted text-foreground/70",
          )}
        >
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
            {Math.abs(trend!).toFixed(1)}{trendUnit}
          </span>
        )}
        {description && <span className="text-muted-foreground">{description}</span>}
      </div>
    </div>
  );
};
