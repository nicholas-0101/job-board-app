"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, User, Eye, EyeOff, LogIn } from "lucide-react";
import { apiCall } from "@/helper/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";

interface CreateReviewDialogProps {
  open: boolean;
  onClose: () => void;
  company: any;
  onReviewSubmitted?: () => void;
  userEmployment?: any;
}

export default function CreateReviewDialog({
  open,
  onClose,
  company,
  onReviewSubmitted,
  userEmployment,
}: CreateReviewDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState({
    positionTitle: "",
    isAnonymous: true,
    ratingCulture: 0,
    ratingFacilities: 0,
    ratingWorkLife: 0,
    ratingCareer: 0,
    salaryEstimateMin: "",
    salaryEstimateMax: "",
    body: "",
  });

  // Check authentication status and pre-fill employment data
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Pre-fill position title from employment data
    if (userEmployment && userEmployment.positionTitle) {
      setFormData((prev) => ({
        ...prev,
        positionTitle: userEmployment.positionTitle,
      }));
    }
  }, [open, userEmployment]);

  const handleRatingClick = (category: string, rating: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: rating,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.positionTitle.trim()) {
      toast.error("Position title is required");
      return;
    }

    if (!formData.body.trim()) {
      toast.error("Review content is required");
      return;
    }

    const ratings = [
      formData.ratingCulture,
      formData.ratingFacilities,
      formData.ratingWorkLife,
      formData.ratingCareer,
    ];

    if (ratings.some((rating) => rating === 0)) {
      toast.error("Please provide all ratings");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        positionTitle: formData.positionTitle,
        isAnonymous: formData.isAnonymous,
        ratingCulture: formData.ratingCulture,
        ratingFacilities: formData.ratingFacilities,
        ratingWorkLife: formData.ratingWorkLife,
        ratingCareer: formData.ratingCareer,
        salaryEstimateMin: formData.salaryEstimateMin
          ? parseInt(formData.salaryEstimateMin)
          : null,
        salaryEstimateMax: formData.salaryEstimateMax
          ? parseInt(formData.salaryEstimateMax)
          : null,
        body: formData.body,
      };

      await apiCall.post(`/reviews/companies/${company.id}/reviews`, payload);

      toast.success("Review submitted successfully!");

      // Reset form
      setFormData({
        positionTitle: "",
        isAnonymous: true,
        ratingCulture: 0,
        ratingFacilities: 0,
        ratingWorkLife: 0,
        ratingCareer: 0,
        salaryEstimateMin: "",
        salaryEstimateMax: "",
        body: "",
      });

      // Notify parent component to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }

      onClose();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const InteractiveStarRating = ({
    rating,
    onRatingClick,
    label,
  }: {
    rating: number;
    onRatingClick: (rating: number) => void;
    label: string;
  }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center gap-4">
          <StarRating
            rating={rating}
            size="lg"
            interactive={true}
            onRatingClick={onRatingClick}
            showValue={false}
            className="justify-start"
          />
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#467EC7]/10 to-[#24CFA7]/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#467EC7]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Review {company.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Share your experience working at this company
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isAuthenticated ? (
              // Login Required Message
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#467EC7]/10 to-[#24CFA7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogIn className="w-8 h-8 text-[#467EC7]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Login Required
                </h3>
                <p className="text-gray-600 mb-6">
                  You need to be logged in to write a review for this company.
                </p>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/signin");
                    }}
                    className="px-6 py-3 bg-[#24CFA7] text-white rounded-lg hover:bg-[#24CFA7]/90 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            ) : (
              // Review Form
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Employment Context */}
                {userEmployment && (
                  <div className="bg-[#E1F1F3] border border-[#467EC7]/20 rounded-lg p-4">
                    <h4 className="font-medium text-[#467EC7] mb-2">
                      Your Employment at {company.name}
                    </h4>
                    <div className="text-sm text-[#467EC7] space-y-1">
                      <p>
                        <strong>Position:</strong>{" "}
                        {userEmployment.positionTitle}
                      </p>
                      <p>
                        <strong>Duration:</strong>{" "}
                        {new Date(
                          userEmployment.startDate
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {userEmployment.isCurrent
                          ? "Present"
                          : userEmployment.endDate
                          ? new Date(
                              userEmployment.endDate
                            ).toLocaleDateString()
                          : "Present"}
                      </p>
                      {userEmployment.isCurrent && (
                        <span className="inline-flex items-center gap-1 text-[#24CFA7] text-xs font-medium">
                          <div className="w-2 h-2 bg-[#24CFA7] rounded-full"></div>
                          Currently employed
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Position Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title *
                  </label>
                  <input
                    type="text"
                    value={formData.positionTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        positionTitle: e.target.value,
                      }))
                    }
                    placeholder="e.g. Software Engineer, Product Manager"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent outline-none transition-all"
                    required
                  />
                  {userEmployment && (
                    <p className="text-xs text-gray-500 mt-1">
                      Pre-filled from your employment record. You can modify if
                      needed.
                    </p>
                  )}
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {formData.isAnonymous ? (
                      <EyeOff className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        Anonymous Review
                      </p>
                      <p className="text-sm text-gray-500">
                        {formData.isAnonymous
                          ? "Your name will not be shown publicly"
                          : "Your name will be visible to others"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isAnonymous: !prev.isAnonymous,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      formData.isAnonymous ? "bg-[#24CFA7]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.isAnonymous ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Ratings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">
                    Rate Your Experience
                  </h3>
                  <div className="space-y-3">
                    <InteractiveStarRating
                      rating={formData.ratingCulture}
                      onRatingClick={(rating) =>
                        handleRatingClick("ratingCulture", rating)
                      }
                      label="Company Culture"
                    />
                    <InteractiveStarRating
                      rating={formData.ratingFacilities}
                      onRatingClick={(rating) =>
                        handleRatingClick("ratingFacilities", rating)
                      }
                      label="Facilities & Benefits"
                    />
                    <InteractiveStarRating
                      rating={formData.ratingWorkLife}
                      onRatingClick={(rating) =>
                        handleRatingClick("ratingWorkLife", rating)
                      }
                      label="Work-Life Balance"
                    />
                    <InteractiveStarRating
                      rating={formData.ratingCareer}
                      onRatingClick={(rating) =>
                        handleRatingClick("ratingCareer", rating)
                      }
                      label="Career Growth"
                    />
                  </div>
                </div>

                {/* Salary Estimate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Estimate (IDR/month)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={formData.salaryEstimateMin}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          salaryEstimateMin: e.target.value,
                        }))
                      }
                      placeholder="Min salary"
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent outline-none transition-all"
                    />
                    <input
                      type="number"
                      value={formData.salaryEstimateMax}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          salaryEstimateMax: e.target.value,
                        }))
                      }
                      placeholder="Max salary"
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Review Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Review *
                  </label>
                  <textarea
                    value={formData.body}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    placeholder="Share your experience working at this company..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#467EC7] focus:border-transparent outline-none transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-[#24CFA7] text-white rounded-lg hover:bg-[#24CFA7]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
