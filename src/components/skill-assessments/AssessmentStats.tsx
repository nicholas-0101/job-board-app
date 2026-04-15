import { BookOpen, Users } from "lucide-react";
import { AssessmentStats as StatsType } from "@/types/skillAssessment";

interface AssessmentStatsProps {
  stats: StatsType;
}

// Helper functions (max 15 lines each)
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('id-ID').format(num);
};

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  gradientFrom,
  gradientTo,
  iconBg,
  iconColor,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  gradientFrom: string;
  gradientTo: string;
  iconBg: string;
  iconColor: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1.5">{subtitle}</p>
        )}
      </div>
      <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${iconBg}`}>
        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${iconColor}`} />
      </div>
    </div>
  </div>
);

export default function AssessmentStats({ stats }: AssessmentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <StatCard
        icon={BookOpen}
        title="Total Assessments"
        value={formatNumber(stats.totalAssessments)}
        subtitle="Available tests"
        gradientFrom="from-blue-50"
        gradientTo="to-indigo-50"
        iconBg="bg-blue-100"
        iconColor="text-blue-800"
      />
      <StatCard
        icon={Users}
        title="Total Participants"
        value={formatNumber(stats.totalParticipants)}
        subtitle="Users tested"
        gradientFrom="from-emerald-50"
        gradientTo="to-teal-50"
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />
    </div>
  );
}
