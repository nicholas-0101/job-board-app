"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "../../../../components/ui/AnimatedCounter";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | undefined | null;
  change: number | undefined | null;
  icon: any;
  color: string;
}

export function StatCard({ title, value, change, icon: Icon, color }: StatCardProps) {
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="text-2xl font-semibold">
              {value !== undefined && value !== null ? <AnimatedCounter end={value} /> : <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>}
            </div>
            {change !== undefined && change !== null && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(change)}% vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}