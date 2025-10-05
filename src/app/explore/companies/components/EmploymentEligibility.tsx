"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, CheckCircle, XCircle, Clock, Building2 } from "lucide-react";
import { apiCall } from "@/helper/axios";

interface EmploymentEligibilityProps {
  companyId: number;
  onEligibilityCheck?: (isEligible: boolean, employment?: any) => void;
}

interface Employment {
  id: number;
  positionTitle: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  company: {
    id: number;
    name: string;
  };
}

interface EligibilityData {
  isEligible: boolean;
  employment?: Employment;
  hasExistingReview: boolean;
  existingReview?: any;
  message: string;
}

export default function EmploymentEligibility({ 
  companyId, 
  onEligibilityCheck 
}: EmploymentEligibilityProps) {
  const [eligibilityData, setEligibilityData] = useState<EligibilityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    
    if (token) {
      checkEligibility();
    } else {
      setLoading(false);
    }
  }, [companyId]);

  const checkEligibility = async () => {
    try {
      const response = await apiCall.get(`/reviews/companies/${companyId}/reviews/eligibility`);
      const data = response.data.data;
      
      setEligibilityData(data);
      
      // Notify parent component
      if (onEligibilityCheck) {
        onEligibilityCheck(data.isEligible, data.employment);
      }
      
    } catch (error: any) {
      console.error("Error checking eligibility:", error);
      console.error("Error response:", error.response?.data);
      
      const fallbackData = {
        isEligible: false,
        hasExistingReview: false,
        message: error.response?.data?.message || "Unable to check eligibility"
      };
      
      setEligibilityData(fallbackData);
      
      if (onEligibilityCheck) {
        onEligibilityCheck(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (!isAuthenticated) {
    return null; // Don't show anything if not authenticated
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
      >
        <div className="flex items-center gap-3">
          <div className="animate-spin">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-blue-700">Checking review eligibility...</p>
        </div>
      </motion.div>
    );
  }

  if (!eligibilityData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border rounded-lg p-4 mb-4 ${
        eligibilityData.isEligible
          ? "bg-green-50 border-green-200"
          : eligibilityData.hasExistingReview
          ? "bg-yellow-50 border-yellow-200"
          : "bg-red-50 border-red-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${
          eligibilityData.isEligible
            ? "bg-green-100"
            : eligibilityData.hasExistingReview
            ? "bg-yellow-100"
            : "bg-red-100"
        }`}>
          {eligibilityData.isEligible ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : eligibilityData.hasExistingReview ? (
            <Briefcase className="w-5 h-5 text-yellow-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold mb-1 ${
            eligibilityData.isEligible
              ? "text-green-800"
              : eligibilityData.hasExistingReview
              ? "text-yellow-800"
              : "text-red-800"
          }`}>
            {eligibilityData.isEligible
              ? "You can write a review"
              : eligibilityData.hasExistingReview
              ? "You already reviewed this company"
              : "Review not available"
            }
          </h3>
          
          <p className={`text-sm mb-2 ${
            eligibilityData.isEligible
              ? "text-green-700"
              : eligibilityData.hasExistingReview
              ? "text-yellow-700"
              : "text-red-700"
          }`}>
            {eligibilityData.message}
          </p>

          {/* Employment Information */}
          {eligibilityData.employment && (
            <div className="bg-white rounded-md p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-900">
                  {eligibilityData.employment.positionTitle}
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>
                  {formatDate(eligibilityData.employment.startDate)} - {" "}
                  {eligibilityData.employment.isCurrent 
                    ? "Present" 
                    : eligibilityData.employment.endDate 
                      ? formatDate(eligibilityData.employment.endDate)
                      : "Present"
                  }
                </p>
                {eligibilityData.employment.isCurrent && (
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs font-medium">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Currently employed
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Existing Review Information */}
          {eligibilityData.hasExistingReview && eligibilityData.existingReview && (
            <div className="bg-white rounded-md p-3 border border-gray-200 mt-2">
              <p className="text-sm text-gray-600 mb-1">Your previous review:</p>
              <p className="text-sm font-medium text-gray-900">
                "{eligibilityData.existingReview.positionTitle}"
              </p>
              <p className="text-xs text-gray-500">
                Reviewed on {formatDate(eligibilityData.existingReview.createdAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
