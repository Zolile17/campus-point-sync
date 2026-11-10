import { TooltipProps } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/** Categorical order — fixed, never cycled. Validated for CVD separation in light & dark. */
export const SERIES = [
  "hsl(var(--chart-1))", // slate blue
  "hsl(var(--chart-2))", // teal
  "hsl(var(--chart-3))", // amber
  "hsl(var(--chart-4))", // violet
];

/** Fixed colour per entity so filters never repaint survivors */
export const CATEGORY_COLOR: Record<string, string> = {
  "All Day Menu": SERIES[0],
  Beverages: SERIES[1],
  "Add-ons": SERIES[2],
};

export const CAMPUS_COLOR: Record<string, string> = {
  "Cape Town": SERIES[0],
  Durban: SERIES[1],
  "Nelson Mandela Bay": SERIES[2],
  Pretoria: SERIES[3],
};

export const INK = "hsl(var(--foreground))";
export const MUTED_INK = "hsl(var(--muted-foreground))";
export const GRID = "hsl(var(--border))";

export const axisProps = {
  stroke: MUTED_INK,
  tick: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
  tickLine: false,
  axisLine: false,
} as const;

type Fmt = (value: number, name: string) => string;

/** Shared tooltip: text in ink tokens, a colour swatch carries identity. */
export const ChartTooltip = ({
  active,
  payload,
  label,
  formatter,
}: TooltipProps<ValueType, NameType> & { formatter?: Fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[150px] rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label !== undefined && <p className="mb-1.5 font-medium text-foreground">{label}</p>}
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={String(p.dataKey) + p.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm" style={{ background: p.color || (p.payload?.fill as string) }} />
              {p.name}
            </span>
            <span className="tabular font-medium text-foreground">
              {formatter ? formatter(Number(p.value), String(p.name)) : p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Legend = ({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
    {items.map((i) => (
      <span key={i.label} className="flex items-center gap-1.5">
        {i.dashed ? (
          <span className="h-0 w-3.5 border-t-2 border-dashed" style={{ borderColor: i.color }} />
        ) : (
          <span className="h-2.5 w-2.5 rounded-sm" style={{ background: i.color }} />
        )}
        {i.label}
      </span>
    ))}
  </div>
);
