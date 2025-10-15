"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { Briefcase, CheckCircle, Users, Calendar } from "lucide-react";

interface StatsOverviewProps {
  loading: boolean;
  stats: {
    totalJobs: number;
    publishedJobs: number;
    totalApplicants: number;
    totalInterviews: number;
  };
}

export function StatsOverview({ loading, stats }: StatsOverviewProps) {
  const statsData = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Published Jobs",
      value: stats.publishedJobs,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Applicants",
      value: stats.totalApplicants,
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Scheduled Interviews",
      value: stats.totalInterviews,
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold">
                      {loading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                      ) : (
                        <AnimatedCounter end={stat.value} />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
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
