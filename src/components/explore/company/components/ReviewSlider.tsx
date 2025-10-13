"use client";

import { Review } from "../types/review.types";
import ReviewCard from "./ReviewCard";

interface ReviewSliderProps {
  reviews: Review[];
  currentSlide: number;
  hasMore: boolean;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function ReviewSlider({
  reviews,
  currentSlide,
  hasMore,
  loading,
  onPrev,
  onNext,
}: ReviewSliderProps) {
  const slides = (() => {
    const chunked: Review[][] = [];
    for (let i = 0; i < reviews.length; i += 2) {
      chunked.push(reviews.slice(i, i + 2));
    }
    return chunked;
  })();

  const lastSlideIndex = Math.max(slides.length - 1, 0);
  const isLastSlide = currentSlide >= lastSlideIndex;
  const canGoNext =
    slides.length > 0 && (currentSlide < lastSlideIndex || hasMore);

  return (
    <div className="hidden md:block relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((group, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {group.map((review, index) => (
                  <ReviewCard key={review.id} review={review} index={index} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        type="button"
        aria-label="Previous reviews"
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border border-[#E1F1F3] bg-white text-[#467EC7] disabled:opacity-40 shadow-sm hover:bg-[#E1F1F3]"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next reviews"
        onClick={onNext}
        disabled={!canGoNext && !loading}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full border border-[#E1F1F3] bg-white text-[#467EC7] disabled:opacity-40 shadow-sm hover:bg-[#E1F1F3]"
      >
        ›
      </button>
    </div>
  );
}
