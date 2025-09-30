import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

export const StatsCard = ({ title, value, description, icon: Icon, trend, gradient }: StatsCardProps) => {
  const gradientStyle = gradient ? { background: gradient } : {};
  
  return (
    <Card className="overflow-hidden border-0 shadow-lg">
      <CardContent className="p-6 text-white relative" style={gradientStyle}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-white/90">{title}</p>
            <p className="text-4xl font-bold text-white">{value}</p>
            <p className="text-xs text-white/80">{description}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-sm font-medium text-white/90`}>
                <TrendingUp className={`h-4 w-4 ${!trend.isPositive && "rotate-180"}`} />
                <span>{trend.value}%</span>
              </div>
            )}
          </div>
          <div className="rounded-full p-3 bg-white/20 backdrop-blur-sm">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
