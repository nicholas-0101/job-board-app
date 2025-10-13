"use client";

import CompanyDetailCard from "./CompanyDetailCard";
import CompanyReviews from "./CompanyReviews";
import CompanyJobsSection from "./CompanyJobsSection";

interface MobileLayoutProps {
  company: any;
  onReviewSubmitted: () => void;
  reviewRefreshTrigger: number;
}

export default function MobileLayout({ company, onReviewSubmitted, reviewRefreshTrigger }: MobileLayoutProps) {
  return (
    <div className="flex flex-col lg:hidden space-y-4 sm:space-y-6">
      {/* Company Detail Card */}
      <CompanyDetailCard 
        company={company} 
        onReviewSubmitted={onReviewSubmitted}
      />
      
      {/* Company Jobs */}
      <CompanyJobsSection company={company} isMobile={true} />
      
      {/* Company Reviews */}
      <CompanyReviews 
        companyId={company.id} 
        refreshTrigger={reviewRefreshTrigger}
      />
    </div>
  );
}
