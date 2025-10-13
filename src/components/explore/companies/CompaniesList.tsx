"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader, SearchX } from "lucide-react";
import { CompanyCard } from "../company/CompanyCard";

interface CompaniesListProps {
  loading: boolean;
  companies: any[];
  viewMode: "grid" | "list";
  page: number;
  filters: {
    order?: "asc" | "desc";
  };
}

export default function CompaniesList({
  loading,
  companies,
  viewMode,
  page,
  filters,
}: CompaniesListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-16 sm:py-20">
        <h3 className="text-lg sm:text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
          <SearchX size={40} className="sm:w-12 sm:h-12" color="#24CFA7" /> 
          <span className="px-4">No companies found</span>
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground px-4">
          Try adjusting filters or searching a different keyword.
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${page}-${filters.order}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`grid gap-3 sm:gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {companies.map((c) => (
          <CompanyCard key={c.id} {...c} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
