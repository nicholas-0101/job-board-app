"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Grid3x3,
  List,
  Loader,
  SearchX,
} from "lucide-react";
import { apiCall } from "@/helper/axios";
import SearchBar from "@/components/site/SearchBar";
import { CompanyCard } from "./components/CompanyCard";
import { useRouter } from "next/navigation";
import { getCityFromCoords, getUserLocation } from "@/lib/utils/locationUtils";

type Filters = {
  keyword?: string;
  location?: string;
  sort?: "name" | "jobsCount";
  order?: "asc" | "desc";
};

export default function CompaniesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    sort: "name",
    order: "asc",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [companies, setCompanies] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
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
  }, []);

  useEffect(() => {
    const fetchLocationAndSetCity = async () => {
      try {
        const pos = await getUserLocation();
        const { latitude, longitude } = pos.coords;
        const { city } = await getCityFromCoords(latitude, longitude);

        if (city && !filters.location) {
          setSearchInputs((prev) => ({ ...prev, location: city }));
          setFilters((prev) => ({ ...prev, location: city }));
        }
      } catch (err) {
        console.warn("Geolocation failed or denied:", err);
      }
    };

    if (!filters.location) {
      fetchLocationAndSetCity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall.get("/company/all", {
        params: {
          keyword: filters.keyword || undefined,
          city: filters.location || undefined,
          limit,
          page,
          sortBy: filters.sort,
          sortOrder: filters.order,
        },
      });

      const companiesData = res.data.data.map((c: any) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        locationCity: c.locationCity,
        jobs: c._count?.jobs || 0,
        logo: c.logo || "",
        rating: Math.floor(Math.random() * 2) + 4,
      }));

      setCompanies(companiesData);
      setTotal(res.data.total ?? 0);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();

    const params = new URLSearchParams();
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.location) params.set("city", filters.location);
    if (page > 1) params.set("page", page.toString());

    const newUrl = `/explore/companies${
      params.toString() ? "?" + params.toString() : ""
    }`;
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/25 py-20">
        <div className="absolute inset-0" />
        <div className="relative container mx-auto px-4 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center items-center"
          >
            <h1 className="text-5xl font-bold mb-6 text-[#467EC7]">
              Choose Your{" "}
              <span className="text-[#24CFA7]">Perfect Company</span>
            </h1>
            <p className="text-xl opacity-90 mb-8 text-muted-foreground max-w-3xl">
              Find the companies that share your values, match your skills, and
              offer the growth opportunities you're looking for
            </p>

            <div className="w-full lg:max-w-5xl z-1">
              <SearchBar
                keyword={searchInputs.keyword}
                setKeyword={(v) =>
                  setSearchInputs((prev) => ({ ...prev, keyword: v }))
                }
                city={searchInputs.location}
                setCity={(v) =>
                  setSearchInputs((prev) => ({ ...prev, location: v }))
                }
                onSearch={handleSearch}
              />
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      <section className="pb-12 lg:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-9">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {companies.length}
                </span>{" "}
                of {total} companies
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

            {/* Company List */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader className="w-8 h-8 text-[#24CFA7]" />
                </motion.div>
              </div>
            ) : companies.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
                  <SearchX size={48} color="#24CFA7" /> No companies found
                  matching your search.
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
                  {companies.map((c) => (
                    <CompanyCard key={c.id} {...c} />
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
