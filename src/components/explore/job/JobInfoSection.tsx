"use client";

import Link from "next/link";
import { MapPin, Clock, Building2 } from "lucide-react";

interface JobInfoSectionProps {
  job: {
    company?: {
      slug?: string;
      name?: string;
    };
    city: string;
    applyDeadline?: string;
    category: string;
    salaryMin?: number;
    salaryMax?: number;
    tags?: string[];
  };
}

export default function JobInfoSection({ job }: JobInfoSectionProps) {
  return (
    <>
      {/* Company + City + Deadline */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          {job.company?.slug ? (
            <Link
              href={`/explore/companies/${job.company.slug}`}
              className="text-muted-foreground hover:underline text-sm sm:text-base"
            >
              {job.company.name}
            </Link>
          ) : (
            <span className="text-sm sm:text-base">{job.company?.name}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span className="text-sm sm:text-base">{job.city}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span className="text-sm sm:text-base">
            Deadline:{" "}
            {job.applyDeadline
              ? new Date(job.applyDeadline).toDateString()
              : "N/A"}
          </span>
        </div>
      </div>

      {/* Category */}
      <p className="mb-4 text-sm sm:text-base">
        <span className="font-medium">Category:</span> {job.category}
      </p>

      {/* Salary */}
      {(job.salaryMin || job.salaryMax) && (
        <div className="flex items-center gap-1 text-foreground text-base sm:text-lg font-semibold mb-4">
          <span>
            IDR {job.salaryMin?.toLocaleString()} -{" "}
            {job.salaryMax?.toLocaleString()}
          </span>
        </div>
      )}

      {/* Tags */}
      {job.tags && job.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
          {job.tags.map((tag: string, idx: number) => (
            <span
              key={idx}
              className="px-2.5 sm:px-3 py-1 bg-primary/3 text-primary text-xs font-medium rounded-full border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
