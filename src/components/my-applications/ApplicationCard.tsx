"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Briefcase, Building2 } from "lucide-react";
import { formatIDR, formatStatus, statusStyles, ApplicationStatus } from "@/lib/utils/applicationUtils";

interface Application {
  id: number;
  cvUrl: string;
  expectedSalary: number;
  status: string;
  reviewNote?: string;
  job: {
    id: number;
    slug: string;
    title: string;
    city: string;
    category: string;
    salaryMin: number;
    salaryMax: number;
    company: {
      id: number;
      name: string;
      logo: string | null;
    };
  };
  createdAt: string;
}

interface ApplicationCardProps {
  application: Application;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F0F5F9] rounded-xl p-4 sm:p-6 relative"
    >
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <span
          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-bold ${
            statusStyles[application.status as ApplicationStatus] ||
            "bg-gray-100 text-gray-600"
          }`}
        >
          {formatStatus(application.status as ApplicationStatus)}
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-[#467EC7] mb-2 pr-20 sm:pr-24">
        {application.job.title}
      </h2>
      <p className="text-xs sm:text-sm text-gray-600 mb-1 flex gap-2 items-center">
        <Building2
          size={16}
          className="sm:w-[18px] sm:h-[18px]"
        />{" "}
        {application.job.company.name} • {application.job.city}
      </p>
      <p className="text-xs sm:text-sm text-gray-500 mb-4 flex gap-2 items-center">
        <Briefcase
          size={16}
          className="sm:w-[18px] sm:h-[18px]"
        />{" "}
        {application.job.category} • {formatIDR(application.job.salaryMin)} –{" "}
        {formatIDR(application.job.salaryMax)}
      </p>

      <div className="space-y-2 text-xs sm:text-sm">
        <p>
          <span className="font-medium">Expected Salary:</span>{" "}
          {formatIDR(application.expectedSalary)}
        </p>
        <p>
          <span className="font-medium">CV:</span>{" "}
          <a
            href={application.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#467EC7] underline"
          >
            View CV
          </a>
        </p>
        {application.reviewNote && (
          <div className="mt-2 p-2 sm:p-3 bg-[#E6F5F1] text-[#0F766E] rounded-lg text-xs sm:text-sm border border-[#24CFA7]">
            <span className="font-medium">Review Note:</span>{" "}
            {application.reviewNote}
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4">
        <button
          onClick={() =>
            router.push(`/explore/jobs/${application.job.slug}`)
          }
          className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
        >
          View Job Details
        </button>
      </div>
    </motion.div>
  );
}
