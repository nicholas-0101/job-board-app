import { JobItemDTO } from "@/lib/jobs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: JobItemDTO;
  onTogglePublish: (job: JobItemDTO) => void;
}

export default function JobCard({ job, onTogglePublish }: JobCardProps) {
  return (
    <div
      className="hover:shadow-lg transition-all duration-300 border-l-4"
      style={{
        borderLeftColor: job.isPublished ? "#24CFA7" : "#94a3b8",
      }}
    >
      <div className="p-5">
        {/* Job Banner */}
        {job.banner && (
          <div className="mb-4 -mx-5 -mt-5">
            <img
              src={job.banner}
              alt={`${job.title} banner`}
              className="w-full h-32 object-cover rounded-t-lg"
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate mb-2">
              {job.title}
            </h3>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                {job.category}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {job.city}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                {job.applicantsCount} applicants
              </span>
              {job.isPublished ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                  Draft
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap mt-4">
          <Button
            size="sm"
            onClick={() => onTogglePublish(job)}
            className="bg-[#467EC7] hover:bg-[#578BCC] whitespace-nowrap shadow-md"
          >
            {job.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Link href={`/admin/jobs/${job.id}/edit`}>
            <Button
              size="sm"
              className="bg-[#24CFA7] hover:bg-[#1fc39c] whitespace-nowrap shadow-md"
            >
              Edit
            </Button>
          </Link>
          <Link href={`/admin/jobs/${job.id}/applicants`}>
            <Button
              size="sm"
              variant="outline"
              className="whitespace-nowrap hover:bg-secondary"
            >
              Applicants ({job.applicantsCount})
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
