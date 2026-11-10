import { Ban, CheckCircle2, Clock, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "approved" | "declined" | "pending" | "cancelled" | "active" | "inactive";

const styles: Record<Status, { cls: string; Icon: typeof CheckCircle2; label: string }> = {
  approved: { cls: "bg-success/10 text-success ring-success/20", Icon: CheckCircle2, label: "Approved" },
  active: { cls: "bg-success/10 text-success ring-success/20", Icon: CheckCircle2, label: "Active" },
  declined: { cls: "bg-brand/10 text-brand ring-brand/20", Icon: XCircle, label: "Declined" },
  cancelled: { cls: "bg-muted text-muted-foreground ring-border", Icon: Ban, label: "Cancelled" },
  inactive: { cls: "bg-muted text-muted-foreground ring-border", Icon: MinusCircle, label: "Inactive" },
  pending: { cls: "bg-warning/10 text-warning ring-warning/25", Icon: Clock, label: "Pending" },
};

export const StatusPill = ({ status, className }: { status: Status; className?: string }) => {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        s.cls,
        className,
      )}
    >
      <s.Icon className="h-3.5 w-3.5" />
      {s.label}
    </span>
  );
};
