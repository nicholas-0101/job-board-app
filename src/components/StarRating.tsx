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
      // Always return integer rating (1-5 stars)
      onRatingClick(starValue);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const starValue = index + 1;
        // For display mode: support decimal ratings (e.g., 3.5 stars)
        // For interactive mode: only integer ratings (1-5 stars)
        const isFullyFilled = rating >= starValue;
        const isPartiallyFilled = !interactive && rating > (starValue - 1) && rating < starValue;
        const fillPercentage = isPartiallyFilled ? ((rating - (starValue - 1)) * 100) : 100;

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
            
            {/* Filled star (full or partial) */}
            {(isFullyFilled || isPartiallyFilled) && (
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  key={`fill-${starValue}-${rating}`}
                  className="h-full overflow-hidden"
                  initial={{ width: "0%" }}
                  animate={{ width: `${isFullyFilled ? 100 : fillPercentage}%` }}
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
          {interactive ? Math.round(rating) : rating.toFixed(1)}
        </motion.span>
      )}
    </div>
  );
}
