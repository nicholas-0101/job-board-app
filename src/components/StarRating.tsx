"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRatingClick?: (rating: number) => void;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = true,
  interactive = false,
  onRatingClick,
  className = "",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const starSize = sizeClasses[size];
  const textSize = textSizeClasses[size];

  const handleStarClick = (starValue: number, event?: React.MouseEvent) => {
    if (interactive && onRatingClick) {
      if (event) {
        // Calculate more precise rating based on click position within the star
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const starWidth = rect.width;
        const clickPercentage = clickX / starWidth;
        
        // Round to nearest 0.5 for better UX
        const preciseRating = starValue - 1 + clickPercentage;
        const roundedRating = Math.round(preciseRating * 2) / 2;
        const finalRating = Math.max(0.5, Math.min(5, roundedRating));
        
        onRatingClick(finalRating);
      } else {
        onRatingClick(starValue);
      }
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        // Fix: Calculate fill percentage correctly for decimal ratings
        const starRating = Math.max(0, Math.min(1, rating - index));
        const fillPercentage = starRating * 100;
        const isPartiallyFilled = fillPercentage > 0 && fillPercentage < 100;
        const isFullyFilled = fillPercentage >= 100;
        
        // Debug: Test calculation for rating 4.5
        // Star 1: rating=4.5, index=0, starRating=1, fillPercentage=100 ✓
        // Star 2: rating=4.5, index=1, starRating=1, fillPercentage=100 ✓
        // Star 3: rating=4.5, index=2, starRating=1, fillPercentage=100 ✓
        // Star 4: rating=4.5, index=3, starRating=1, fillPercentage=100 ✓
        // Star 5: rating=4.5, index=4, starRating=0.5, fillPercentage=50 ✓

        return (
          <motion.div
            key={starValue}
            className={`relative ${starSize} ${interactive ? 'cursor-pointer' : ''}`}
            onClick={(e) => handleStarClick(starValue, e)}
            whileHover={interactive ? { scale: 1.1 } : {}}
            whileTap={interactive ? { scale: 0.95 } : {}}
          >
            {/* Background star (empty) */}
            <Star className={`absolute inset-0 ${starSize} fill-gray-200 text-gray-200`} />
            
            {/* Filled star with smooth width animation for partial fills */}
            {(isFullyFilled || isPartiallyFilled) && (
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  key={`fill-${starValue}-${rating}`}
                  className="h-full overflow-hidden"
                  initial={{ width: "0%" }}
                  animate={{ width: `${fillPercentage}%` }}
                  transition={{ 
                    duration: interactive ? 0.3 : 0.6, 
                    ease: "easeOut",
                    delay: interactive ? 0 : index * 0.1 
                  }}
                >
                  <Star className={`${starSize} fill-yellow-400 text-yellow-400`} />
                </motion.div>
              </div>
            )}
            
            {/* Interactive hover overlay */}
            {interactive && (
              <Star 
                className={`absolute inset-0 ${starSize} opacity-0 hover:opacity-30 transition-opacity fill-yellow-300 text-yellow-300`}
              />
            )}
          </motion.div>
        );
      })}
      
      {showValue && (
        <motion.span 
          className={`ml-2 ${textSize} text-gray-600 font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {rating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
}
