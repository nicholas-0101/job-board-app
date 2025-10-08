import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import { Payment } from "../types";

interface HistoryStatsProps {
  payments: Payment[];
}

export default function HistoryStats({ payments }: HistoryStatsProps) {
  const stats = [
    {
      title: "Total Revenue",
      value: `Rp ${payments
        .filter(p => p.status === "APPROVED")
        .reduce((sum, p) => sum + (typeof p.amount === 'string' ? parseFloat(p.amount) : p.amount), 0)
        .toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Approved",
      value: payments.filter(p => p.status === "APPROVED").length,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Pending",
      value: payments.filter(p => p.status === "PENDING").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Rejected",
      value: payments.filter(p => p.status === "REJECTED").length,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
