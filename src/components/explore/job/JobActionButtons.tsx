"use client";

import { Share2, Bookmark } from "lucide-react";

interface JobActionButtonsProps {
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

export default function JobActionButtons({
  preselectionStatus,
  saved,
  onPretestClick,
  onApplyClick,
  onShareClick,
  onSaveClick,
}: JobActionButtonsProps) {
  return (
    <div className="flex sm:hidden items-center justify-between gap-2 mt-6 pt-4 border-t border-border">
      <div className="flex items-center gap-2">
        {preselectionStatus?.required && (
          preselectionStatus.submitted ? (
            <div className={`px-3 py-2 rounded-lg text-xs font-medium cursor-not-allowed ${
              preselectionStatus.isPassed 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {preselectionStatus.isPassed ? 'Passed' : 'Failed'} {preselectionStatus.score}/{preselectionStatus.passingScore}
            </div>
          ) : (
            <button
              onClick={onPretestClick}
              className="px-3 py-2 rounded-lg bg-[#467EC7] text-white hover:bg-[#467EC7]/80 text-xs font-medium transition-colors cursor-pointer"
            >
              Take Pretest
            </button>
          )
        )}
        <button
          onClick={onApplyClick}
          className="px-3 py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-xs font-medium transition-colors cursor-pointer"
        >
          Apply
        </button>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onShareClick}
          className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-foreground" />
        </button>
        <button
          onClick={onSaveClick}
          className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 ${
              saved ? "text-foreground fill-current" : "text-foreground"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
