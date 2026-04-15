"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export type OverviewStat = { label: string; value: number; color: string; icon: any; iconColor?: string };

export function OverviewStatsGrid({ stats, loading }: { stats: OverviewStat[]; loading: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-md h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-2 sm:gap-3 md:flex-row md:items-center md:justify-between md:text-left">
                  <div className="min-w-0">
                    <div className="text-2xl font-semibold">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                      ) : (
                        <AnimatedCounter end={stat.value} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.color} shrink-0`}>
                    <IconComponent className={`w-5 h-5 ${stat.iconColor || 'text-white'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}


