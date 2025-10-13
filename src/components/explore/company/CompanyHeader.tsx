"use client";

import { motion } from "framer-motion";
import { Share2 } from "lucide-react";

interface CompanyHeaderProps {
  company: any;
  isEligibleToReview: boolean;
  onReviewClick: () => void;
  onShareClick: () => void;
}

export default function CompanyHeader({
  company,
  isEligibleToReview,
  onReviewClick,
  onShareClick,
}: CompanyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-primary shadow-sm flex-shrink-0"
        >
          {company.logo ? (
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg flex-shrink-0"
            />
          ) : (
            company.name?.charAt(0)
          )}
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#467EC7]">
          {company.name}
        </h1>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <button
          onClick={onReviewClick}
          disabled={!isEligibleToReview}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isEligibleToReview
              ? "bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 cursor-pointer"
              : "bg-[#24CFA7]/60 text-white cursor-not-allowed"
          }`}
        >
          Review
        </button>
        <button
          className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
          onClick={onShareClick}
        >
          <Share2 className="w-5 h-5 text-foreground" />
        </button>
      </div>
    </div>
  );
}
