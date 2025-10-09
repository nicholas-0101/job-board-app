"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Loader, SearchX } from "lucide-react";

import { apiCall } from "@/helper/axios";
import Container from "@/components/common/Container";
import { JobCard } from "../../jobs/components/JobCard";
import CompanyDetailCard from "../components/CompanyDetailCard";
import CompanyReviews from "../components/CompanyReviews";

export default function CompanyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchCompany = async () => {
      try {
        const res = await apiCall.get(`/company/${slug}`);
        setCompany(res.data.data);
      } catch (err) {
        console.error("Failed to fetch company:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [slug]);

  const handleReviewSubmitted = () => {
    setReviewRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
            <SearchX size={48} color="#24CFA7" /> Company not found.
          </h3>
          <p className="text-muted-foreground">
            Please select another company.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#24CFA7]/10 via-white to-[#467EC7]/10">
      <Container className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Company Detail */}
          <div className="lg:col-span-8 space-y-6">
            <CompanyDetailCard 
              company={company} 
              onReviewSubmitted={handleReviewSubmitted}
            />
            <CompanyReviews 
              companyId={company.id} 
              refreshTrigger={reviewRefreshTrigger}
            />
          </div>

          {/* Company Jobs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Jobs at {company.name}
              </h2>
              <a
                href="/explore/jobs"
                className="text-[#467EC7] hover:opacity-80 font-medium flex items-center gap-1 transition-colors"
              >
                See all <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="grid gap-3">
              {company.jobs?.length > 0 ? (
                company.jobs.map((job: any) => (
                  <JobCard
                    key={job.slug}
                    id={job.id}
                    slug={job.slug}
                    title={job.title}
                    company={company.name}
                    logo={company.logoUrl}
                    city={job.city}
                    salary={
                      job.salaryMin && job.salaryMax
                        ? `${job.salaryMin} - ${job.salaryMax}`
                        : ""
                    }
                    category={job.category}
                    tags={job.tags || []}
                    rating={company.companyRating || 0}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  No jobs available from this company.
                </p>
              )}
            </div>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}
