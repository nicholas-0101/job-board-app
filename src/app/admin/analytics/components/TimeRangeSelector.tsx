"use client";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download } from "lucide-react";

export function TimeRangeSelector({
  timeRange,
  setTimeRange,
  onRefresh,
  onExport,
}: {
  timeRange: string;
  setTimeRange: (v: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}) {
  return (
    <div className="mt-2 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <label htmlFor="timeRange" className="text-sm text-muted-foreground">
          Time range
        </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border rounded-md bg-background"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
        <Button className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]" onClick={onRefresh}>
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
        <Button variant="outline" className="gap-2" onClick={onExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
}


