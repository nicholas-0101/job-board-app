"use client";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export function OverviewStatCard({ title, value, icon: Icon, color }: { title: string; value: number; icon: any; color: string }) {
  return (
    <Card className="shadow-md">
      <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:p-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-3xl font-semibold text-foreground">
          <AnimatedCounter end={typeof value === "number" ? value : Number(value ?? 0)} />
        </div>
      </CardContent>
    </Card>
  );
}


