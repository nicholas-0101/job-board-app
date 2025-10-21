"use client";

import { motion } from "framer-motion";
import SearchBar from "@/components/site/SearchBar";

interface JobsHeroProps {
  searchInputs: {
    keyword: string;
    location: string;
  };
  onKeywordChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
  onLocationInteraction?: () => void;
}

export default function JobsHero({
  searchInputs,
  onKeywordChange,
  onLocationChange,
  onSearch,
  onLocationInteraction,
}: JobsHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/20 py-12 sm:py-16 md:py-20">
      <div className="absolute inset-0" />
      <div className="relative container mx-auto px-4 text-center max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center items-center"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#467EC7]">
            Choose Your <span className="text-[#24CFA7]">Next Career</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 text-muted-foreground max-w-3xl px-4">
            Discover opportunities that align with your passion and skills, and
            take the next step toward the career you've always dreamed of
          </p>

          <div className="w-full lg:max-w-5xl z-1 px-2 sm:px-4">
            <SearchBar
              keyword={searchInputs.keyword}
              setKeyword={onKeywordChange}
              city={searchInputs.location}
              setCity={onLocationChange}
              onSearch={onSearch}
              onLocationInteraction={onLocationInteraction}
            />
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
