"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Activity } from "lucide-react";

export function InterestsGrid({ interests }: { interests: any[] | null }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Activity className="w-5 h-5 text-rose-400" />
          Most Popular Job Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        {interests && Array.isArray(interests) && interests.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interests.map((interest: any, index: number) => (
              <motion.div
                key={interest.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl border hover:shadow-md transition-all bg-card"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter end={interest.applications} />
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{interest.category}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-gradient-to-r from-rose-200 to-rose-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${interest.percentage ?? 0}%` }} />
                  </div>
                  <div className="text-sm font-medium text-rose-500">{interest.percentage ?? 0}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">No interest data available</div>
        )}
      </CardContent>
    </Card>
  );
}


