"use client";

import CompanyDetailCard from "./CompanyDetailCard";
import CompanyReviews from "./CompanyReviews";
import CompanyJobsSection from "./CompanyJobsSection";

interface DesktopLayoutProps {
  company: any;
  onReviewSubmitted: () => void;
  reviewRefreshTrigger: number;
}

export default function DesktopLayout({ company, onReviewSubmitted, reviewRefreshTrigger }: DesktopLayoutProps) {
  return (
    <div className="hidden lg:grid grid-cols-12 gap-6">
      {/* Company Detail */}
      <div className="col-span-8 space-y-6">
        <CompanyDetailCard 
          company={company} 
          onReviewSubmitted={onReviewSubmitted}
        />
        <CompanyReviews 
          companyId={company.id} 
          refreshTrigger={reviewRefreshTrigger}
        />
      </div>

      {/* Company Jobs */}
      <CompanyJobsSection company={company} isMobile={false} />
    </div>
  );
}
