"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Edit } from "lucide-react";

export function OverviewHeader({
  loading,
  onRefresh,
  companyInfo,
}: {
  loading: boolean;
  onRefresh: () => void;
  companyInfo: any;
}) {
  return (
    <header className="space-y-4 rounded-3xl border bg-white/70 px-4 py-6 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:max-w-2xl">
            Manage your job board platform with real-time stats, recent activity, and quick actions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={onRefresh} disabled={loading} className="h-10 gap-2 bg-[#467EC7] hover:bg-[#578BCC] shadow-md">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          {companyInfo && (
            <Link href="/admin/jobs/new">
              <Button className="h-10 gap-2 bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                <Plus className="h-4 w-4" />
                Post New Job
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}


