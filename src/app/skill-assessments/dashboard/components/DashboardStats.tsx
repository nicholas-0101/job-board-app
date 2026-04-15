"use client";
import { Award, CheckCircle, Trophy, TrendingUp } from "lucide-react";

interface AssessmentResult {
  id: number;
  score: number;
  isPassed: boolean;
  certificateUrl?: string;
  assessment: {
    badgeTemplate?: {
      name: string;
    };
  };
}

interface DashboardStatsProps {
  results: AssessmentResult[];
}

export default function DashboardStats({ results }: DashboardStatsProps) {
  const totalAssessments = results.length;
  const passedAssessments = results.filter(r => r.isPassed).length;
  const certificatesEarned = results.filter(r => r.certificateUrl).length;
  const averageScore = totalAssessments > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalAssessments)
    : 0;

  const stats = [
    {
      title: "Total Assessments",
      value: totalAssessments,
      icon: Award,
      iconColor: "text-blue-900",
      iconBg: "bg-blue-100",
      gradientFrom: "from-blue-50",
      gradientTo: "to-indigo-50",
    },
    {
      title: "Passed",
      value: passedAssessments,
      icon: CheckCircle,
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-100",
      gradientFrom: "from-emerald-50",
      gradientTo: "to-teal-50",
    },
    {
      title: "Certificates",
      value: certificatesEarned,
      icon: Trophy,
      iconColor: "text-amber-700",
      iconBg: "bg-amber-100",
      gradientFrom: "from-amber-50",
      gradientTo: "to-yellow-50",
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: TrendingUp,
      iconColor: "text-purple-900",
      iconBg: "bg-purple-100",
      gradientFrom: "from-purple-50",
      gradientTo: "to-fuchsia-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${stat.gradientFrom} ${stat.gradientTo} p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.iconBg}`}>
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

