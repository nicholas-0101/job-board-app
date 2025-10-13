"use client";

import { User } from "lucide-react";

interface LoadingStateProps {
  reviewsCount: number;
}

export function LoadingState({ reviewsCount }: LoadingStateProps) {
  if (reviewsCount > 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-5 sm:h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-3 sm:p-4 space-y-2">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-6 sm:py-8">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <User className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
      </div>
      <p className="text-sm sm:text-base text-red-600 font-medium">
        Failed to load reviews
      </p>
      <p className="text-xs sm:text-sm text-red-500 mb-3 sm:mb-4 px-4">
        {error}
      </p>
      <button
        onClick={onRetry}
        className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
      >
        Try Again
      </button>
    </div>
  );
}

interface EmptyStateProps {}

export function EmptyState({}: EmptyStateProps) {
  return (
    <div className="text-center py-6 sm:py-8">
      <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-sm sm:text-base text-gray-500">No reviews yet</p>
      <p className="text-xs sm:text-sm text-gray-400">
        Be the first to review this company
      </p>
    </div>
  );
}
