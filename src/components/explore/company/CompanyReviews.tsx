"use client";

import { motion } from "framer-motion";
import { CompanyReviewsProps } from "./types/review.types";
import { useReviews } from "./hooks/useReviews";
import ReviewStats from "./components/ReviewStats";
import ReviewList from "./components/ReviewList";
import ReviewSlider from "./components/ReviewSlider";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "./components/ReviewStates";

export default function CompanyReviews({
  companyId,
  refreshTrigger,
}: CompanyReviewsProps) {
  const {
    reviews,
    stats,
    loading,
    error,
    hasMore,
    currentSlide,
    loadMore,
    goPrev,
    goNext,
    retry,
  } = useReviews(companyId, refreshTrigger);

  if (!companyId) {
    return null;
  }

  if (loading && reviews.length === 0) {
    return <LoadingState reviewsCount={reviews.length} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E1F1F3]"
    >
      {stats && <ReviewStats stats={stats} />}

      {error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ReviewList
            reviews={reviews}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMore}
          />
          <ReviewSlider
            reviews={reviews}
            currentSlide={currentSlide}
            hasMore={hasMore}
            loading={loading}
            onPrev={goPrev}
            onNext={goNext}
          />
        </>
      )}
    </motion.div>
  );
}
