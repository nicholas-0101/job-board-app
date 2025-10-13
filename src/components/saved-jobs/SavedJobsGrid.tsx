"use client";

import { JobCard } from "../explore/job/JobCard";

interface SavedJob {
  id: number;
  createdAt: string;
  job: {
    id: number;
    slug: string;
    title: string;
    city: string;
    company: {
      id: number;
      name: string;
      logoUrl: string | null;
    };
    category: string;
    salaryMin: number;
    salaryMax: number;
    tags: string[];
    rating?: number;
  };
}

interface SavedJobsGridProps {
  savedJobs: SavedJob[];
}

export default function SavedJobsGrid({ savedJobs }: SavedJobsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedJobs.map((savedJob) => {
        const job = savedJob.job;
        return (
          <JobCard
            key={savedJob.id}
            id={job.id}
            slug={job.slug}
            title={job.title}
            company={job.company.name}
            logo={job.company.logoUrl || ""}
            city={job.city}
            salary={`${job.salaryMin}-${job.salaryMax}`}
            category={job.category}
            tags={job.tags}
            rating={job.rating || 0}
          />
        );
      })}
    </div>
  );
}
