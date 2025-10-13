"use client";

import { useParams } from "next/navigation";
import { useCompanyDetail } from "@/lib/hooks/useCompanyDetail";
import Container from "@/components/common/Container";
import CompanyLoadingSpinner from "@/components/explore/company/CompanyLoadingSpinner";
import CompanyNotFound from "@/components/explore/company/CompanyNotFound";
import MobileLayout from "@/components/explore/company/MobileLayout";
import DesktopLayout from "@/components/explore/company/DesktopLayout";

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const { company, loading, reviewRefreshTrigger, handleReviewSubmitted } =
    useCompanyDetail(slug);

  if (loading) {
    return <CompanyLoadingSpinner />;
  }

  if (!company) {
    return <CompanyNotFound />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
      <Container className="py-4 sm:py-6">
        <MobileLayout 
          company={company} 
          onReviewSubmitted={handleReviewSubmitted}
          reviewRefreshTrigger={reviewRefreshTrigger}
        />
        
        <DesktopLayout 
          company={company} 
          onReviewSubmitted={handleReviewSubmitted}
          reviewRefreshTrigger={reviewRefreshTrigger}
        />
      </Container>
    </section>
  );
}
