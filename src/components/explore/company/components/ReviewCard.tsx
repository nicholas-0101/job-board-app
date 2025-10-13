"use client";

import { User, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Review } from "../types/review.types";

interface ReviewCardProps {
  review: Review;
  index: number;
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return null;
  if (min && max)
    return `IDR ${min.toLocaleString()} - ${max.toLocaleString()}`;
  if (min) return `IDR ${min.toLocaleString()}+`;
  return `Up to IDR ${max?.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export default function ReviewCard({ review, index }: ReviewCardProps) {
  return (
    <motion.div
      key={review.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-[#E1F1F3] rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow bg-white hover:border-[#467EC7]/30"
    >
      <div className="flex items-start mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-[#467EC7]/10 to-[#24CFA7]/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[#467EC7] text-sm sm:text-base">
              {review.isAnonymous !== false
                ? "Anonymous"
                : review.reviewerSnapshot ||
                  review.reviewer?.name ||
                  "Anonymous"}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="truncate">
                  {review.positionTitle}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{formatDate(review.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 text-xs sm:text-sm">
        <div>
          <span className="text-[#A3B6CE]">Culture: </span>
          <span className="font-medium text-[#467EC7]">
            {review.ratingCulture}/5
          </span>
        </div>
        <div>
          <span className="text-[#A3B6CE]">Facilities: </span>
          <span className="font-medium text-[#467EC7]">
            {review.ratingFacilities}/5
          </span>
        </div>
        <div>
          <span className="text-[#A3B6CE]">Work-Life: </span>
          <span className="font-medium text-[#467EC7]">
            {review.ratingWorkLife}/5
          </span>
        </div>
        <div>
          <span className="text-[#A3B6CE]">Career: </span>
          <span className="font-medium text-[#467EC7]">
            {review.ratingCareer}/5
          </span>
        </div>
      </div>

      {(review.salaryEstimateMin || review.salaryEstimateMax) && (
        <div className="mb-3 p-2 bg-[#24CFA7]/10 rounded text-xs sm:text-sm border border-[#24CFA7]/20">
          <span className="text-[#24CFA7] font-medium">
            Salary Estimate:{" "}
            {formatSalary(
              review.salaryEstimateMin,
              review.salaryEstimateMax
            )}
          </span>
        </div>
      )}

      <p className="text-[#A3B6CE] leading-relaxed text-sm sm:text-base">
        {review.body}
      </p>
    </motion.div>
  );
}
