"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3, List, Loader2 } from "lucide-react";

import SearchBarPro from "@/components/jobs/SearchBar";
import { HomeJobCard } from "@/components/jobs/HomePageJobCard";
import { listPublicJobs, JobsListDTO } from "@/lib/jobs";

type Filters = {
  keyword?: string;
  category?: string;
  location?: string;
  sort?: "createdAt" | "deadline";
  order?: "asc" | "desc";
};

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    sort: "createdAt",
    order: "desc",
  });

  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);

  const [data, setData] = useState<JobsListDTO>({
    total: 0,
    limit,
    offset: 0,
    items: [],
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs whenever filters, page, or limit change
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const offset = (page - 1) * limit;

      try {
        const res = await listPublicJobs({
          title: filters.keyword,
          category: filters.category,
          city: filters.location,
          sortBy: filters.sort,
          sortOrder: filters.order,
          limit,
          offset,
        });

        // Transform jobs exactly like homepage
        const jobsData = res.items.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.companyName || "Unknown",
          logo: job.companyLogo || "",
          city: job.city,
          salary: job.salary || "",
          category: job.category || "",
          tags: job.tags || [],
          rating: Math.floor(Math.random() * 2) + 4,
        }));

        setData({
          total: res.total,
          limit: res.limit,
          offset: offset,
          items: jobsData,
        });
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [filters, page, limit]);

  const paginatedItems = data.items;
  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="min-h-screen bg-background">
      {/* Search bar */}
      <section className="container mx-auto px-4 py-8">
        <SearchBarPro
          keyword={filters.keyword || ""}
          setKeyword={(v: string) =>
            setFilters((prev) => ({ ...prev, keyword: v }))
          }
          city={filters.location || ""}
          setCity={(v: string) =>
            setFilters((prev) => ({ ...prev, location: v }))
          }
          onSearch={() => setPage(1)}
        />
      </section>

      {/* Listings */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {paginatedItems.length}
                </span>{" "}
                of {data.total} jobs
              </p>
              <div className="flex items-center gap-2 bg-card text-card-foreground rounded-xl p-1 shadow-sm border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            ) : (
              <>
                {paginatedItems.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-foreground">
                      No results found
                    </h3>
                    <p className="text-muted-foreground">
                      Try adjusting filters or searching a different keyword.
                    </p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={page}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`grid gap-4 ${
                        viewMode === "grid"
                          ? "md:grid-cols-2 lg:grid-cols-3"
                          : "grid-cols-1"
                      }`}
                    >
                      {paginatedItems.map((job) => (
                        <HomeJobCard key={job.id} {...job} />
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground/80 hover:bg-secondary disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-xl font-medium ${
                        page === i + 1
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card text-foreground/80 hover:bg-secondary"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground/80 hover:bg-secondary disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}