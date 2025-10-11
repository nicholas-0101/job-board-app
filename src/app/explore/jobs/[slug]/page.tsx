"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Loader, SearchX } from "lucide-react";

import { apiCall } from "@/helper/axios";
import Container from "@/components/common/Container";
import { JobCard } from "../components/JobCard";
import JobDetailCard from "../components/JobDetailCard";
import CompanyInfoCard from "../components/CompanyInfoCard";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string; 

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const fetchJob = async () => {
      try {
        const res = await apiCall.get(`/job/${slug}`);
        setJob(res.data.data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  useEffect(() => {
    if (!job) return;

    const fetchRelatedJobs = async () => {
      try {
        const res = await apiCall.get("/job/all", {
          params: {
            city: job.city,
            category: job.category,
            limit: 3,
          },
        });

        const jobsData = res.data.data
          .filter((j: any) => j.id !== job.id)
          .map((j: any) => ({
            id: j.id,
            slug: j.slug,
            title: j.title,
            company: j.companyName,
            logo: j.companyLogo || "",
            city: j.city,
            salary: j.salary || "",
            category: j.category || "",
            tags: j.tags || [],
            rating: Math.floor(Math.random() * 2) + 4,
          }));

        setRelatedJobs(jobsData);
      } catch (err) {
        console.error("Failed to fetch related jobs:", err);
      }
    };

    fetchRelatedJobs();
  }, [job]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-16 sm:py-20">
          <h3 className="text-lg sm:text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
            <SearchX size={40} className="sm:w-12 sm:h-12" color="#24CFA7" /> 
            <span className="px-4">Job not found.</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground px-4">Please select another job.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
      <Container className="py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Job Detail */}
          <div className="lg:col-span-8 flex flex-col gap-3 sm:gap-4">
            <JobDetailCard job={job} />
            <CompanyInfoCard company={job.company} />
          </div>

          {/* Related Jobs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Related Jobs
              </h2>
              <a
                href="/explore/jobs"
                className="text-[#467EC7] hover:opacity-80 font-medium flex items-center gap-1 transition-colors text-sm sm:text-base"
              >
                See all <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </a>
            </div>
            <div className="grid gap-2 sm:gap-3">
              {relatedJobs.length > 0 ? (
                relatedJobs.map((job) => <JobCard key={job.slug} {...job} />)
              ) : (
                <p className="text-muted-foreground text-xs sm:text-sm">
                  No related jobs found.
                </p>
              )}
            </div>
          </motion.section>
        </div>
      </Container>
    </section>
  );
}
