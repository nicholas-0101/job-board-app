"use client";

interface PreselectionStatusBannerProps {
  preselectionStatus: {
    required: boolean;
    submitted?: boolean;
    score?: number | null;
    passingScore?: number | null;
    isPassed?: boolean;
  } | null;
}

export default function PreselectionStatusBanner({
  preselectionStatus,
}: PreselectionStatusBannerProps) {
  if (!preselectionStatus?.required || !preselectionStatus.isPassed) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg">
      <p className="text-green-800 text-sm text-center">
        ✓ Pre-selection Test Passed (Score: {preselectionStatus.score}/
        {preselectionStatus.passingScore || 25})
      </p>
    </div>
  );
}
