import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyJobsState() {
  return (
    <Card className="border-dashed shadow-md">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#467EC7]"
            >
              <rect
                width="20"
                height="14"
                x="2"
                y="7"
                rx="2"
                ry="2"
              />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              No jobs yet
            </p>
            <p className="text-muted-foreground">
              Create your first job posting to start attracting
              candidates
            </p>
          </div>
          <Link href="/admin/jobs/new">
            <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] mt-2">
              Create First Job
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
