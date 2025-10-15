"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Briefcase, Eye, TrendingUp } from "lucide-react";
import { JobItemDTO } from "@/lib/jobs";

interface JobStatsProps {
  jobs: JobItemDTO[];
}

export default function JobStats({ jobs }: JobStatsProps) {
  const stats = [
    {
      label: "Total Jobs",
      value: jobs.length,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Published Jobs",
      value: jobs.filter((job) => job.isPublished).length,
      icon: Eye,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Draft Jobs",
      value: jobs.filter((job) => !job.isPublished).length,
      icon: Briefcase,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Total Applicants",
      value: jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0),
      icon: Users,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
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
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
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
