"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, TestTube, CheckCircle, XCircle } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  index: number;
}

export function StatsCard({ label, value, icon: Icon, color, index }: StatsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
    >
      <Card className="shadow-md h-full">
        <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold text-foreground">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface StatsOverviewProps {
  tests: Array<{
    jobId: number;
    jobTitle: string;
    isActive: boolean;
    totalQuestions: number;
    passingScore: number | null;
  }>;
}

export function StatsOverview({ tests }: StatsOverviewProps) {
  const activeCount = tests.filter((t) => t.isActive).length;
  
  const stats = [
    { label: "Total Jobs", value: tests.length, icon: Briefcase, color: "from-blue-500 to-blue-600" },
    { label: "Jobs with Tests", value: tests.filter(t=>t.totalQuestions>0).length, icon: TestTube, color: "from-purple-500 to-purple-600" },
    { label: "Active Tests", value: activeCount, icon: CheckCircle, color: "from-green-500 to-green-600" },
    { label: "Inactive Tests", value: tests.filter(t=>!t.isActive).length, icon: XCircle, color: "from-gray-500 to-gray-600" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          index={index}
        />
      ))}
    </div>
  );
}
