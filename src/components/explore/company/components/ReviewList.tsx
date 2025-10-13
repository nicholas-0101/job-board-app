"use client";

import { Review } from "../types/review.types";
import ReviewCard from "./ReviewCard";

interface ReviewListProps {
  reviews: Review[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

export default function ReviewList({ 
  reviews, 
  hasMore, 
  loading, 
  onLoadMore 
}: ReviewListProps) {
  return (
    <div className="md:hidden">
      <div className="max-h-[70vh] overflow-y-auto space-y-3 sm:space-y-4 pr-1">
        {reviews.map((review, index) => (
          <ReviewCard key={review.id} review={review} index={index} />
        ))}

        {hasMore && (
          <div className="text-center pt-3 sm:pt-4 pb-2">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="px-4 sm:px-6 py-2 border border-[#467EC7] text-[#467EC7] rounded-lg hover:bg-[#467EC7] hover:text-white transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Loading..." : "Load More Reviews"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
