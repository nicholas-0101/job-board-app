"use client";

import { SearchX } from "lucide-react";

export default function JobsEmptyState() {
  return (
    <div className="text-center py-16 sm:py-20 md:py-30">
      <h3 className="text-lg sm:text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
        <SearchX size={40} className="sm:w-12 sm:h-12" color="#24CFA7" />
        <span className="px-4">No jobs found matching your search.</span>
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground px-4">
        Try adjusting filters or searching a different keyword.
      </p>
    </div>
  );
}
