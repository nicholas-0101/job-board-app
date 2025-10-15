"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface JobsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function JobsHeader({ loading, onRefresh }: JobsHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Job Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create, manage, and track your job postings
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={onRefresh}
              disabled={loading}
              className="gap-2 bg-[#467EC7] hover:bg-[#578BCC] shadow-md"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Link href="/admin/jobs/new">
              <Button className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                <Plus className="w-5 h-5" />
                Post New Job
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
