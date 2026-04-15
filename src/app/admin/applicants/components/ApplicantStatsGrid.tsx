"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export type StatItem = { label: string; value: number; color: string; icon: any; iconColor?: string };

export function ApplicantStatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <IconComponent className={`w-5 h-5 ${stat.iconColor || 'text-white'}`} />
                </div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}


