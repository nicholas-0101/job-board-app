"use client";
import { Briefcase, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SearchBarProps {
  keyword: string;
  setKeyword: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  onSearch: (shouldScroll: boolean) => void;
}

export default function SearchBar({
  keyword,
  setKeyword,
  city,
  setCity,
  onSearch,
}: SearchBarProps) {
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (keyword === "" && city === "") {
      onSearch(false);
    }
  }, [keyword, city, onSearch]);

  return (
    <div className="w-full rounded-2xl border border-input bg-card text-card-foreground shadow-sm">
      <div className="grid md:grid-cols-3 gap-3 p-3">
        <div className="relative">
          <Briefcase
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          />
          <input
            aria-label="Job title or keyword"
            className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-input focus:border-primary focus:outline-none"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(true)}
          />
        </div>
        <div className="relative">
          <MapPin
            aria-hidden
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
          />
          <input
            aria-label="City"
            className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-input focus:border-primary focus:outline-none"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch(true)}
          />
        </div>
        <motion.button
          type="button"
          className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#24CFA7] text-primary-foreground font-medium shadow-sm hover:bg-[#39D4B0] transition-all flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => onSearch(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Search className="w-5 h-5" />
          Search
        </motion.button>
      </div>
    </div>
  );
}
