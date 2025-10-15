"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobItemDTO } from "@/lib/jobs";

interface JobSelectorProps {
  jobs: JobItemDTO[];
  selectedJobId: number | null;
  onJobSelect: (jobId: number) => void;
}

export default function JobSelector({ jobs, selectedJobId, onJobSelect }: JobSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Job</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onJobSelect(job.id)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedJobId === job.id
                  ? "bg-blue-50 border-blue-200 text-blue-900"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <div className="font-medium">{job.title}</div>
              <div className="text-sm text-gray-600">
                {job.applicantsCount} applicants
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
