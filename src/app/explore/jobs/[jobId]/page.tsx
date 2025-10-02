"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ExternalLink, Loader, SearchX } from "lucide-react";

import { apiCall } from "@/helper/axios";
import Container from "@/components/common/Container";
import { JobCard } from "../components/JobCard";
import JobDetailCard from "../components/JobDetailCard";

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      try {
        const res = await apiCall.get(`/job/${jobId}`);
        setJob(res.data.data);
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  useEffect(() => {
    if (!job) return;

    const fetchRelatedJobs = async () => {
      try {
        const res = await apiCall.get("/job/all", {
          params: {
            // city: job.city,
            // category: job.category,
            limit: 3,
          },
        });

        const jobsData = res.data.data
          .filter((j: any) => j.id !== job.id)
          .map((j: any) => ({
            id: j.id,
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
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 text-[#24CFA7]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
            <SearchX size={48} color="#24CFA7" /> Job not found.
          </h3>
          <p className="text-muted-foreground">Please select another job.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Job Detail */}
          <div className="lg:col-span-8">
            <JobDetailCard job={job} />
          </div>

          {/* Related Jobs */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Related Jobs
              </h2>
              <a
                href="/explore/jobs"
                className="text-[#467EC7] hover:opacity-80 font-medium flex items-center gap-1 transition-colors"
              >
                See all <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="grid gap-3">
              {relatedJobs.length > 0 ? (
                relatedJobs.map((job) => <JobCard key={job.id} {...job} />)
              ) : (
                <p className="text-muted-foreground text-sm">
                  No related jobs found.
                </p>
              )}
            </div>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}
