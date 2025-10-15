"use client";
import { Button } from "@/components/ui/button";
import { Users, RefreshCw } from "lucide-react";

interface ApplicantsHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export function ApplicantsHeader({ loading, onRefresh }: ApplicantsHeaderProps) {
  return (
    <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Users className="w-6 h-6 text-[#467EC7]" />
              Job Applicants
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and review job applications
            </p>
          </div>
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
        </div>
      </div>
    </div>
  );
}
