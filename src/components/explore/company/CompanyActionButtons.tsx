"use client";

import { Share2 } from "lucide-react";

interface CompanyActionButtonsProps {
  isEligibleToReview: boolean;
  onReviewClick: () => void;
  onShareClick: () => void;
}

export default function CompanyActionButtons({
  isEligibleToReview,
  onReviewClick,
  onShareClick,
}: CompanyActionButtonsProps) {
  return (
    <div className="flex sm:hidden items-center justify-between gap-2 mt-6 pt-4 border-t border-border">
      <button
        onClick={onReviewClick}
        disabled={!isEligibleToReview}
        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
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
        <Share2 className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
}
