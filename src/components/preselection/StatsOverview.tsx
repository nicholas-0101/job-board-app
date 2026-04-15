"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, TestTube, CheckCircle, XCircle, Circle, CircleAlert, CircleDashed, CircleMinus } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor?: string;
  index: number;
}

export function StatsCard({ label, value, icon: Icon, color, iconColor, index }: StatsCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: index * 0.1 }}
    >
      <Card className="shadow-md h-full">
        <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
            <Icon className={`h-6 w-6 ${iconColor || 'text-white'}`} />
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
    passingScore: number | null;
    totalQuestions: number;
    hasDraft: boolean;
  }>;
}

export function StatsOverview({ tests }: StatsOverviewProps) {
  const activeCount = tests.filter((t) => t.isActive).length;
  const draftCount = tests.filter(t => t.hasDraft && !t.isActive).length;
  const inactiveCount = tests.filter(t => !t.isActive && !t.hasDraft).length;
  
  const stats = [
    { label: "Total Jobs", value: tests.length, icon: Briefcase, color: "bg-blue-100", iconColor: "text-blue-500" },
    { label: "Active Tests", value: activeCount, icon: CheckCircle, color: "bg-emerald-100", iconColor: "text-emerald-500" },
    { label: "Draft Tests", value: draftCount, icon: CircleMinus, color: "bg-amber-100", iconColor: "text-amber-500" },
    { label: "Inactive Tests", value: inactiveCount, icon: XCircle, color: "bg-gray-100", iconColor: "text-gray-500" },
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
          iconColor={stat.iconColor}
          index={index}
        />
      ))}
    </div>
  );
}
