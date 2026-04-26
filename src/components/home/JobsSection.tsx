"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader } from "lucide-react";
import { JobCard } from "../explore/job/JobCard";
import JobsEmptyState from "./JobsEmptyState";

interface Job {
  id: number;
  slug: string;
  title: string;
  company: string;
  logo: string | null;
  city: string;
  salary: string;
  category: string;
  tags: string[];
  rating: number;
}

interface JobsSectionProps {
  jobs: Job[];
  isLoading?: boolean;
}

export default function JobsSection({ jobs, isLoading }: JobsSectionProps) {
  return (
    <section className="container mx-auto px-4 py-8 sm:py-12 md:py-16 min-h-[100vh]">
      <div className="text-center mb-8 sm:mb-10 md:mb-12 mt-6 sm:mt-8 md:mt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#467EC7] mb-2">
          Explore Your Dream Career
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Find career that match your passion
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 sm:py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 sm:w-10 sm:h-10 text-[#24CFA7]" />
          </motion.div>
        </div>
      ) : jobs.length === 0 ? (
        <JobsEmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Math.min(index * 0.06, 0.24) }}
            >
              <JobCard {...job} logo={job.logo || ""} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center mt-8 sm:mt-10">
        <Link href="/explore/jobs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#24CFA7] text-primary-foreground font-semibold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
          >
            Explore All Jobs
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </Link>
      </div>
    </section>
  );
}
