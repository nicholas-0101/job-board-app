"use client";

import { SearchX } from "lucide-react";

export default function SavedJobsEmpty() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
          <SearchX size={48} color="#24CFA7" /> No saved jobs.
        </h3>
        <p className="text-muted-foreground">
          You haven't saved any jobs yet.
        </p>
      </div>
    </div>
  );
}
