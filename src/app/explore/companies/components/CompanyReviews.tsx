"use client";

import { useState, useEffect } from "react";
import { User, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { apiCall } from "@/helper/axios";
import StarRating from "@/components/StarRating";

interface Review {
  id: number;
  positionTitle: string;
  isAnonymous?: boolean;
  reviewerSnapshot?: string;
  ratingCulture: number;
  ratingFacilities: number;
  ratingWorkLife: number;
  ratingCareer: number;
  companyRating?: number;
  salaryEstimateMin?: number;
  salaryEstimateMax?: number;
  body: string;
  createdAt: string;
  reviewer?: {
    id: number;
    name: string;
    email: string;
  };
}

interface ReviewStats {
  totalReviews: number;
  avgCultureRating: string;
  avgFacilityRating: string;
  avgWorklifeRating: string;
  avgCareerRating: string;
  avgOverallRating: string;
  ratingDistribution?: Array<{
    rating: number;
    count: number;
  }>;
}

interface CompanyReviewsProps {
  companyId: number;
  refreshTrigger?: number;
}

export default function CompanyReviews({ companyId, refreshTrigger }: CompanyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (companyId) {
      fetchReviews();
      fetchStats();
    }
  }, [companyId]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchReviews();
      fetchStats();
    }
  }, [refreshTrigger]);

  const fetchReviews = async (pageNum = 1) => {
    try {
      const response = await apiCall.get(
        `/reviews/companies/${companyId}/reviews?page=${pageNum}&limit=3`
      );
      
      if (pageNum === 1) {
        setReviews(response.data.data?.reviews || response.data.data || []);
      } else {
        setReviews(prev => [...prev, ...(response.data.data?.reviews || response.data.data || [])]);
      }
      
      setHasMore((response.data.data?.reviews || []).length === 3);
      setPage(pageNum);
    } catch (error: any) {
      console.error("Error fetching reviews:", error);
      console.error("Error response:", error.response?.data);
      setError(error.response?.data?.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiCall.get(`/reviews/companies/${companyId}/reviews/stats`);
      setStats(response.data.data);
    } catch (error: any) {
      console.error("Error fetching review stats:", error);
      console.error("Error response:", error.response?.data);
      // Don't set error for stats, just log it
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setLoading(true);
      fetchReviews(page + 1);
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null;
    if (min && max) return `IDR ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `IDR ${min.toLocaleString()}+`;
    return `Up to IDR ${max?.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };


  if (!companyId) {
    return null;
  }

  if (loading && reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-[#E1F1F3]"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#467EC7]">Employee Reviews</h2>
        {stats && (
          <div className="text-right">
            <div className="flex items-center gap-2">
              <StarRating rating={parseFloat(stats.avgOverallRating) || 0} />
            </div>
            <p className="text-sm text-gray-500">
              {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Review Statistics */}
      {stats && stats.totalReviews > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-[#E1F1F3] rounded-lg">
          <div className="text-center">
            <p className="text-sm text-[#467EC7] font-medium">Culture</p>
            <StarRating rating={parseFloat(stats.avgCultureRating) || 0} />
          </div>
          <div className="text-center">
            <p className="text-sm text-[#467EC7] font-medium">Facilities</p>
            <StarRating rating={parseFloat(stats.avgFacilityRating) || 0} />
          </div>
          <div className="text-center">
            <p className="text-sm text-[#467EC7] font-medium">Work-Life</p>
            <StarRating rating={parseFloat(stats.avgWorklifeRating) || 0} />
          </div>
          <div className="text-center">
            <p className="text-sm text-[#467EC7] font-medium">Career</p>
            <StarRating rating={parseFloat(stats.avgCareerRating) || 0} />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-red-600 font-medium">Failed to load reviews</p>
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchReviews();
              fetchStats();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Reviews List */}
      {!error && reviews.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400">Be the first to review this company</p>
        </div>
      ) : !error ? (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-[#E1F1F3] rounded-lg p-4 hover:shadow-sm transition-shadow bg-white hover:border-[#467EC7]/30"
            >
              <div className="flex items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#467EC7]/10 to-[#24CFA7]/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#467EC7]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#467EC7]">
                      {review.isAnonymous !== false 
                        ? "Anonymous" 
                        : (review.reviewerSnapshot || review.reviewer?.name || "Anonymous")
                      }
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{review.positionTitle}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                <div>
                  <span className="text-[#A3B6CE]">Culture: </span>
                  <span className="font-medium text-[#467EC7]">{review.ratingCulture}/5</span>
                </div>
                <div>
                  <span className="text-[#A3B6CE]">Facilities: </span>
                  <span className="font-medium text-[#467EC7]">{review.ratingFacilities}/5</span>
                </div>
                <div>
                  <span className="text-[#A3B6CE]">Work-Life: </span>
                  <span className="font-medium text-[#467EC7]">{review.ratingWorkLife}/5</span>
                </div>
                <div>
                  <span className="text-[#A3B6CE]">Career: </span>
                  <span className="font-medium text-[#467EC7]">{review.ratingCareer}/5</span>
                </div>
              </div>

              {/* Salary Info */}
              {(review.salaryEstimateMin || review.salaryEstimateMax) && (
                <div className="mb-3 p-2 bg-[#24CFA7]/10 rounded text-sm border border-[#24CFA7]/20">
                  <span className="text-[#24CFA7] font-medium">
                    Salary Estimate: {formatSalary(review.salaryEstimateMin, review.salaryEstimateMax)}
                  </span>
                </div>
              )}

              {/* Review Content */}
              <p className="text-[#A3B6CE] leading-relaxed">{review.body}</p>
            </motion.div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 border border-[#467EC7] text-[#467EC7] rounded-lg hover:bg-[#467EC7] hover:text-white transition-colors disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
}
