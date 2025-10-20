"use client";
import Link from "next/link";
import { RefreshCw, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ApplicantsHeader({ loading, onRefresh }: { loading: boolean; onRefresh: () => void }) {
  return (
    <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Applicant Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and manage job applicants
            </p>
          </div>
          <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="w-full sm:w-auto gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Link href="/admin/jobs">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <FileText className="w-4 h-4" />
                Manage Jobs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


