"use client";

import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface PreselectionStatusBannerProps {
  preselectionStatus: {
    required: boolean;
    submitted?: boolean;
    score?: number | null;
    passingScore?: number | null;
    isPassed?: boolean;
  } | null;
  isAuthenticated: boolean | null;
}

export default function PreselectionStatusBanner({
  preselectionStatus,
  isAuthenticated,
}: PreselectionStatusBannerProps) {
  if (!preselectionStatus?.required || !isAuthenticated) return null;

  return (
    <div
      className={`mb-4 p-3 sm:p-4 rounded-lg border ${
        preselectionStatus.submitted
          ? preselectionStatus.isPassed
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-300"
          : "bg-yellow-50 border-yellow-300"
      }`}
    >
      <div className="flex items-center gap-2">
        {preselectionStatus.submitted ? (
          preselectionStatus.isPassed ? (
            <>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              <span className="text-green-800 font-medium text-sm sm:text-base">
                ✓ Pre-selection Test Passed (Score:{" "}
                {preselectionStatus.score}/{preselectionStatus.passingScore || 25})
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <span className="text-red-800 font-medium text-sm sm:text-base">
                ✗ Pre-selection Test Failed (Score:{" "}
                {preselectionStatus.score}/{preselectionStatus.passingScore || 25})
              </span>
            </>
          )
        ) : (
          <>
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium text-sm sm:text-base">
              ⚠ Pre-selection Test Required - Complete the test before applying
            </span>
          </>
        )}
      </div>
    </div>
  );
}
