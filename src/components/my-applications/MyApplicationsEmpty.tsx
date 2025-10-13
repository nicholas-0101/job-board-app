"use client";

import { SearchX } from "lucide-react";

export default function MyApplicationsEmpty() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="text-center py-12 sm:py-20">
        <h3 className="text-lg sm:text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
          <SearchX
            size={40}
            className="sm:w-12 sm:h-12"
            color="#24CFA7"
          />{" "}
          No applications found.
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          You haven't applied to any jobs yet.
        </p>
      </div>
    </div>
  );
}
