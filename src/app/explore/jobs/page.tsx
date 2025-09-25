"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3, List, Loader2, Sparkles } from "lucide-react";
import NavbarPro from "@/components/site/Navbar";
import SearchBarPro from "@/components/jobboard/SearchBarPro";
import FilterSidebar from "@/components/jobboard/FilterSidebar";
import JobCardPro from "@/components/jobboard/JobCardPro";
import JobDetailPanel from "@/components/jobboard/JobDetailPanel";
import { listPublicJobs, JobItemDTO, JobsListDTO } from "@/lib/jobs";

type Filters = { keyword?: string; category?: string; location?: string; sort?: "createdAt" | "deadline"; order?: "asc" | "desc" };

export default function JobsPage() {
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({ sort: "createdAt", order: "desc" });
  const [limit, setLimit] = useState(9);
  const [page, setPage] = useState(1);
  const offset = useMemo(() => (page - 1) * limit, [page, limit]);
  const [data, setData] = useState<JobsListDTO>({ total: 0, limit, offset: 0, items: [] });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
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
        setData(res);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, limit, offset]);

  const paginatedItems = data.items;
  const totalPages = Math.max(1, Math.ceil(data.total / limit));

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <SearchBarPro />
      </section>

      {/* Filters and Controls */}
      <section className="container mx-auto px-4 pb-12">
        {/* 3-column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filters */}
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>

          {/* Middle: Listings */}
          <div className="lg:col-span-6">
            {/* Controls Row */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{paginatedItems.length}</span> of {data.total} jobs
              </p>
              <div className="flex items-center gap-2 bg-card text-card-foreground rounded-xl p-1 shadow-sm border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            ) : (
              <>
                {paginatedItems.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-foreground">No results found</h3>
                    <p className="text-muted-foreground">Try adjusting filters or searching a different keyword.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentPage}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`grid gap-4 ${viewMode === "grid" ? "md:grid-cols-2" : "grid-cols-1"}`}
                    >
                      {paginatedItems.map((job, index) => (
                        <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                          <JobCardPro id={job.id} title={job.title} company={job.companyName || ""} city={job.city} tags={[]} posted={new Date(job.createdAt).toDateString()} salary={""} />
                        </motion.div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2" role="navigation" aria-label="Pagination">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground/80 hover:bg-secondary disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium ${
                          page === i + 1 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"
                        }`}
                        aria-current={page === i + 1 ? "page" : undefined}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground/80 hover:bg-secondary disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: Detail/Featured */}
          <div className="lg:col-span-3">
            <JobDetailPanel
              id={1}
              title="Senior Frontend Engineer"
              company="TechNova"
              city="Jakarta"
              description="Join our team to build delightful experiences with Next.js and TailwindCSS. Collaborate with product and design."
            />
          </div>
        </div>
      </section>

      
    </div>
  );
}
