"use client";
import { Briefcase, MapPin, Search } from "lucide-react";

export default function SearchBarPro() {
  return (
    <div className="w-full rounded-2xl border border-input bg-white shadow-sm">
      <div className="grid md:grid-cols-3 gap-3 p-3">
        <div className="relative">
          <Briefcase aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            aria-label="Job title or keyword"
            className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-input focus:border-[#0D6EFD] focus:outline-none"
            placeholder="Job title or keyword"
          />
        </div>
        <div className="relative">
          <MapPin aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            aria-label="City or Remote"
            className="w-full h-12 pl-10 pr-4 rounded-xl border-2 border-input focus:border-[#0D6EFD] focus:outline-none"
            placeholder="City or Remote"
          />
        </div>
        <button className="w-full md:w-auto h-12 px-6 rounded-xl bg-[#0D6EFD] text-white font-medium shadow-sm hover:opacity-90 flex items-center justify-center gap-2">
          <Search className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
}


