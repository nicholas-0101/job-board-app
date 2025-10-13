import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertTriangle, CreditCard, FileText } from "lucide-react";
import { Payment } from "../types";

interface PendingStatsProps {
  payments: Payment[];
}

export default function PendingStats({ payments }: PendingStatsProps) {
  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: payments.length,
    urgent: payments.filter((p) => getDaysAgo(p.createdAt) > 3).length,
    today: payments.filter((p) => getDaysAgo(p.createdAt) === 1).length,
    totalAmount: payments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Total Pending
          </CardTitle>
          <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Awaiting approval</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">
            Pending Value
          </CardTitle>
          <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-lg sm:text-2xl font-bold text-purple-600">
            {formatCurrency(stats.totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">Total pending amount</p>
        </CardContent>
      </Card>
    </div>
  );
}
