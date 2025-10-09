import { Card, CardContent } from "@/components/ui/card";
import { Medal, Award, Target, TrendingUp } from "lucide-react";

interface BadgeStatsProps {
  totalBadges: number;
  passedBadges: number;
  categories: Record<string, { total: number; earned: number }>;
}

export default function BadgeStats({ totalBadges, passedBadges, categories }: BadgeStatsProps) {
  const completionRate = totalBadges > 0 ? Math.round((passedBadges / totalBadges) * 100) : 0;
  const categoryCount = Object.keys(categories).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="border-[#467EC7]/20 bg-gradient-to-br from-[#467EC7]/5 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Badges</p>
              <p className="text-3xl font-bold text-[#467EC7]">{totalBadges}</p>
            </div>
            <div className="w-12 h-12 bg-[#467EC7]/10 rounded-full flex items-center justify-center">
              <Medal className="w-6 h-6 text-[#467EC7]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#24CFA7]/20 bg-gradient-to-br from-[#24CFA7]/5 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Earned Badges</p>
              <p className="text-3xl font-bold text-[#24CFA7]">{passedBadges}</p>
            </div>
            <div className="w-12 h-12 bg-[#24CFA7]/10 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-[#24CFA7]" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-3xl font-bold text-yellow-600">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-purple-600">{categoryCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
