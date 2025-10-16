import { JobItemDTO } from "@/lib/jobs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface JobTableRowProps {
  job: JobItemDTO;
  onTogglePublish: (job: JobItemDTO) => void;
}

export default function JobTableRow({ job, onTogglePublish }: JobTableRowProps) {
  return (
    <tr className="hover:bg-secondary/50 transition-colors">
      <td className="p-4">
        <div className="font-medium text-foreground">
          {job.title}
        </div>
      </td>
      <td className="p-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
          {job.category}
        </span>
      </td>
      <td className="p-4">
        <span className="flex items-center text-sm text-muted-foreground">
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
      </td>
      <td className="p-4">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-purple-100 text-purple-700 font-medium">
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
          {job.applicantsCount}
        </span>
      </td>
      <td className="p-4">
        {job.isPublished ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
            ✓ Published
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
            Draft
          </span>
        )}
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-[#467EC7] hover:bg-[#578BCC] shadow-sm"
            onClick={() => onTogglePublish(job)}
          >
            {job.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Link href={`/admin/jobs/${job.id}/edit`}>
            <Button
              size="sm"
              className="bg-[#24CFA7] hover:bg-[#1fc39c] shadow-sm"
            >
              Edit
            </Button>
          </Link>
          <Link href={`/admin/jobs/${job.id}/applicants`}>
            <Button
              size="sm"
              variant="outline"
              className="hover:bg-secondary"
            >
              Applicants
            </Button>
          </Link>
        </div>
      </td>
    </tr>
  );
}
