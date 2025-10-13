"use client";

import { SearchX } from "lucide-react";

export default function CompanyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center py-16 sm:py-20">
        <h3 className="text-lg sm:text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
          <SearchX size={40} className="sm:w-12 sm:h-12" color="#24CFA7" /> 
          <span className="px-4">Company not found.</span>
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          Please select another company.
        </p>
      </div>
    </div>
  );
}
