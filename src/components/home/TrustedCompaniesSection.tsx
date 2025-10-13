"use client";

import { trustedCompanies } from "@/lib/constants/homepageConstants";

export default function TrustedCompaniesSection() {
  return (
    <section className="relative container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center bg-gradient-to-br from-[#467EC7]/25 via-white/90 to-[#24CFA7]/10">
      <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none" />

      <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-6 sm:mb-8">
        Trusted by professionals from
      </h3>
      <div className="grid grid-cols-2 sm:flex sm:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 flex-wrap">
        {trustedCompanies.map((company) => (
          <a
            key={company.name}
            href={company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-2 text-[#A3B6CE] hover:text-[#467EC7] transition-colors justify-center sm:justify-start"
          >
            <span className="text-2xl sm:text-3xl">{company.logo}</span>
            <span className="text-sm sm:text-lg md:text-xl font-semibold">{company.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
