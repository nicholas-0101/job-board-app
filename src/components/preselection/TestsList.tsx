"use client";
import Link from "next/link";
import { TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TestCard } from "./TestCard";

interface TestSummary {
  jobId: number;
  jobTitle: string;
  isActive: boolean;
  passingScore: number | null;
  totalQuestions: number;
  hasDraft: boolean;
}

interface TestsListProps {
  tests: TestSummary[];
  loading: boolean;
}

export function TestsList({ tests, loading }: TestsListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tests...</p>
        </div>
      </div>
    );
  }

  if (tests.length === 0) {
    return (
      <Card className="border-dashed shadow-md">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary-100 rounded-full">
              <TestTube className="w-10 h-10 text-[#467EC7]" />
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">No jobs available</p>
              <p className="text-muted-foreground">Create jobs first to add pre-selection tests</p>
            </div>
            <Link href="/admin/jobs/new">
              <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] mt-2">Create First Job</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {tests.map((test, index) => (
        <TestCard key={test.jobId} test={test} index={index} />
      ))}
    </div>
  );
}
