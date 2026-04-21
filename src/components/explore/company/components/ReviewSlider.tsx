"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const canGoNext = slides.length > 0 && currentSlide < lastSlideIndex;

  return (
    <div className="hidden md:flex items-center gap-3">
      {/* Left Navigation Button */}
      <button
        type="button"
        aria-label="Previous reviews"
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="shrink-0 p-2 rounded-full border border-[#E1F1F3] bg-white text-[#467EC7] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
      >
        <ChevronLeft />
      </button>

      {/* Slider Content */}
      <div className="flex-1 overflow-hidden">
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

      {/* Right Navigation Button */}
      <button
        type="button"
        aria-label="Next reviews"
        onClick={onNext}
        disabled={!canGoNext && !loading}
        className="shrink-0 p-2 rounded-full border border-[#E1F1F3] bg-white text-[#467EC7] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
