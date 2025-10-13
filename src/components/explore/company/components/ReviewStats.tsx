"use client";

import StarRating from "@/components/review/StarRating";
import { ReviewStats as ReviewStatsType } from "../types/review.types";

interface ReviewStatsProps {
  stats: ReviewStatsType;
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  if (!stats || stats.totalReviews === 0) {
    return null;
  }

  return (
    <>
      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-[#467EC7]">
          Employee Reviews
        </h2>
        <div className="text-left sm:text-right">
          <div className="flex items-center gap-2">
            <StarRating rating={parseFloat(stats.avgOverallRating) || 0} />
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-[#E1F1F3] rounded-lg">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-[#467EC7] font-medium">
            Culture
          </p>
          <StarRating rating={parseFloat(stats.avgCultureRating) || 0} />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-[#467EC7] font-medium">
            Facilities
          </p>
          <StarRating rating={parseFloat(stats.avgFacilityRating) || 0} />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-[#467EC7] font-medium">
            Work-Life
          </p>
          <StarRating rating={parseFloat(stats.avgWorklifeRating) || 0} />
        </div>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-[#467EC7] font-medium">
            Career
          </p>
          <StarRating rating={parseFloat(stats.avgCareerRating) || 0} />
        </div>
      </div>
    </>
  );
}
