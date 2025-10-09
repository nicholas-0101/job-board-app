import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, BookOpen, Users, TrendingUp } from "lucide-react";
import { AssessmentStats as StatsType } from "@/types/skillAssessment";

interface AssessmentStatsProps {
  stats: StatsType;
}

// Helper functions (max 15 lines each)
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

const formatPercentage = (num: number): string => {
  return `${num.toFixed(1)}%`;
};

const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle,
  color = "text-blue-600"
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}) => (
  <Card className="bg-white border border-gray-200">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </CardContent>
  </Card>
);

export default function AssessmentStats({ stats }: AssessmentStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <StatCard
        icon={BookOpen}
        title="Total Assessments"
        value={formatNumber(stats.totalAssessments)}
        subtitle="Available tests"
        color="text-blue-600"
      />
      <StatCard
        icon={Users}
        title="Total Participants"
        value={formatNumber(stats.totalParticipants)}
        subtitle="Users tested"
        color="text-green-600"
      />
    </div>
  );
}
