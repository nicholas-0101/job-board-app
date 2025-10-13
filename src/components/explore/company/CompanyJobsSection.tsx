"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { JobCard } from "../job/JobCard";

interface CompanyJobsSectionProps {
  company: any;
  isMobile?: boolean;
}

export default function CompanyJobsSection({ company, isMobile = false }: CompanyJobsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={isMobile ? "" : "col-span-4"}
    >
      <div className={`flex items-center justify-between ${isMobile ? "mb-3 sm:mb-4" : "mb-4"}`}>
        <h2 className={`font-semibold text-foreground ${isMobile ? "text-base sm:text-lg" : "text-lg"}`}>
          Jobs at {company.name}
        </h2>
        <a
          href="/explore/jobs"
          className={`text-[#467EC7] hover:opacity-80 font-medium flex items-center gap-1 transition-colors ${isMobile ? "text-sm sm:text-base" : ""}`}
        >
          See all <ExternalLink className={isMobile ? "w-3 h-3 sm:w-4 sm:h-4" : "w-4 h-4"} />
        </a>
      </div>

      <div className={`grid ${isMobile ? "gap-2 sm:gap-3" : "gap-3"}`}>
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
          <p className={`text-muted-foreground ${isMobile ? "text-xs sm:text-sm" : "text-sm"}`}>
            No jobs available from this company.
          </p>
        )}
      </div>
    </motion.section>
  );
}
