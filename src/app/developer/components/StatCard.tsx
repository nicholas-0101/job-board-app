import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor?: string;
  isLoading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor,
  iconColor = "text-white",
  isLoading = false,
}: StatCardProps) {
  return (
    <Card
      className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ borderColor: "#E1F1F3" }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-1 px-2 py-3">
        <div className="text-2xl font-bold text-center">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

