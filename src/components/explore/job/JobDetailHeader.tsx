"use client";

import { motion } from "framer-motion";
import { Share2, Bookmark } from "lucide-react";

interface JobDetailHeaderProps {
  jobTitle: string;
  preselectionStatus: {
    required: boolean;
    submitted?: boolean;
    score?: number | null;
    passingScore?: number | null;
    isPassed?: boolean;
  } | null;
  saved: boolean;
  onPretestClick: () => void;
  onApplyClick: () => void;
  onShareClick: () => void;
  onSaveClick: () => void;
}

export default function JobDetailHeader({
  jobTitle,
  preselectionStatus,
  saved,
  onPretestClick,
  onApplyClick,
  onShareClick,
  onSaveClick,
}: JobDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#467EC7]">{jobTitle}</h1>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-2">
        {preselectionStatus?.required && (
          preselectionStatus.submitted ? (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed ${
              preselectionStatus.isPassed 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {preselectionStatus.isPassed ? 'Passed' : 'Failed'} {preselectionStatus.score}/{preselectionStatus.passingScore}
            </div>
          ) : (
            <button
              onClick={onPretestClick}
              className="px-4 py-2 rounded-lg bg-[#467EC7] text-white hover:bg-[#467EC7]/80 text-sm font-medium transition-colors cursor-pointer"
            >
              Take Pretest
            </button>
          )
        )}
        <button
          onClick={onApplyClick}
          className="px-4 py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-sm font-medium transition-colors cursor-pointer"
        >
          Apply
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onShareClick}
            className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
          >
            <Share2 className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={onSaveClick}
            className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
          >
            <Bookmark
              className={`w-5 h-5 ${
                saved ? "text-foreground fill-current" : "text-foreground"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
