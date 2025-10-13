export interface Review {
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

export interface ReviewStats {
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

export interface CompanyReviewsProps {
  companyId: number;
  refreshTrigger?: number;
}
