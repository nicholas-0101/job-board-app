"use client";
import { Card, CardContent } from "@/components/ui/card";
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Passed",
      value: passedAssessments,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Certificates",
      value: certificatesEarned,
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Average Score",
      value: `${averageScore}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
