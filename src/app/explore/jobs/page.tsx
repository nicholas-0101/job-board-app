"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Grid3x3,
  List,
  Loader,
  SearchX,
} from "lucide-react";
import { apiCall } from "@/helper/axios";
import SearchBar from "@/components/site/SearchBar";
import { JobCard } from "@/app/explore/jobs/components/JobCard";
import { useSearchParams, useRouter } from "next/navigation";
import { getCityFromCoords, getUserLocation } from "@/lib/utils/locationUtils";

type Filters = {
  keyword?: string;
  location?: string;
  sort?: "createdAt" | "deadline";
  order?: "asc" | "desc";
};

export default function JobsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    sort: "createdAt",
    order: "desc",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
const [selectedLocation, setSelectedLocation] = useState("");
const [searchInputs, setSearchInputs] = useState({
  keyword: "",
  location: "",
});

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get("keyword") || "";
  const city = params.get("city") || "";
  const pageParam = parseInt(params.get("page") || "1", 10);

  setSearchInputs({ keyword, location: city });
  setFilters((prev) => ({ ...prev, keyword, location: city }));
  setPage(pageParam);
  setSelectedLocation(city);
}, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall.get("/job/all", {
        params: {
          keyword: filters.keyword || undefined,
          city: filters.location || undefined,
          limit,
          page,
          sortBy: filters.sort,
          sortOrder: filters.order,
        },
      });

      const jobsData = res.data.data.map((job: any) => ({
        id: job.id,
        title: job.title,
        company: job.companyName,
        logo: job.companyLogo || "",
        city: job.city,
        salary: job.salary || "",
        category: job.category || "",
        tags: job.tags || [],
        rating: Math.floor(Math.random() * 2) + 4,
      }));

      setJobs(jobsData);
      setTotal(res.data.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();

    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.location) params.set("city", filters.location);
    if (page > 1) params.set("page", page.toString());
    router.replace(`/explore/jobs?${params.toString()}`);
  }, [filters, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleSearch = () => {
    setFilters((prev) => {
      if (
        prev.keyword === searchInputs.keyword &&
        prev.location === searchInputs.location
      ) {
        return prev;
      }
      return {
        ...prev,
        keyword: searchInputs.keyword,
        location: searchInputs.location,
      };
    });
  };

  const getVisiblePages = (current: number, total: number, maxVisible = 5) => {
    const pages: (number | string)[] = [];

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(current - 1, 2);
      let end = Math.min(current + 1, total - 1);
      if (start > 2) pages.push("…");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < total - 1) pages.push("…");

      pages.push(total);
    }

    return pages;
  };

  useEffect(() => {
    const fetchLocationAndSetFilter = async () => {
      try {
        const pos = await getUserLocation();
        const { latitude, longitude } = pos.coords;
        const { city } = await getCityFromCoords(latitude, longitude);

        if (city) {
          setSearchInputs((prev) => ({ ...prev, location: city }));
          setFilters((prev) => ({ ...prev, location: city }));
        }
      } catch (err) {
        console.warn("User denied location or geolocation failed:", err);
      }
    };

    fetchLocationAndSetFilter();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="lg:max-w-6xl mx-auto py-8">
        <SearchBar
          keyword={searchInputs.keyword}
          setKeyword={(v) =>
            setSearchInputs((prev) => ({ ...prev, keyword: v }))
          }
          city={searchInputs.location}
          setCity={(v) => setSearchInputs((prev) => ({ ...prev, location: v }))}
          onSearch={handleSearch}
        />
      </section>

      <section className="lg:max-w-6xl mx-auto pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-9">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {jobs.length}
                </span>{" "}
                of {total} jobs
              </p>
              <div className="flex items-center gap-2 bg-card text-card-foreground rounded-xl p-1 shadow-sm border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-[#467EC7] text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-[#467EC7] text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Job List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader className="w-8 h-8 text-[#24CFA7]" />
                </motion.div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
                  <SearchX size={48} color="#24CFA7" /> No jobs found matching
                  your search.
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
                  {jobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
              >
                <ChevronLeft />
              </button>

              {getVisiblePages(page, totalPages).map((p, i) =>
                typeof p === "string" ? (
                  <span key={i} className="px-3 py-2">
                    {p}
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setPage(p)}
                    className={`w-10 h-10 rounded-xl font-medium ${
                      page === p
                        ? "bg-[#467EC7] text-primary-foreground"
                        : "border border-border bg-[#A3B6CE] text-primary-foreground hover:bg-[#467EC7] transition-colors"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-card text-foreground hover:text-foreground/60 disabled:opacity-30 transition-all"
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
