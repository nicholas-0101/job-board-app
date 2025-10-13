"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SearchBar from "../site/SearchBar";
import StatsSection from "./StatsSection";

interface HeroSectionProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  onSearch: (shouldScroll?: boolean) => void;
}

export default function HeroSection({
  keyword,
  setKeyword,
  selectedLocation,
  setSelectedLocation,
  onSearch,
}: HeroSectionProps) {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <motion.section
      ref={heroRef}
      className="relative min-h-[95vh] bg-grit overflow-hidden bg-gradient-to-br from-[#467EC7]/15 via-white to-[#24CFA7]/25"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-10 md:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5">
            <span className="text-[#467EC7]">Find Your</span>
            <br />
            <span className="text-[#24CFA7]">Dream Career</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
            Connect with top companies and discover opportunities that match
            your skills, passion, and career goals with workoo
          </p>

          <StatsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto px-2 sm:px-4 relative z-10"
        >
          <SearchBar
            keyword={keyword}
            setKeyword={setKeyword}
            city={selectedLocation}
            setCity={setSelectedLocation}
            onSearch={onSearch}
          />
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </motion.section>
  );
}
