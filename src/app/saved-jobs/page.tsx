"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { apiCall } from "@/helper/axios";
import Container from "@/components/common/Container";
import {
  Loader,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDownUp,
  SearchX,
} from "lucide-react";
import { JobCard } from "../explore/jobs/components/JobCard";
import { motion } from "framer-motion";

interface SavedJob {
  id: number;
  createdAt: string;
  job: {
    id: number;
    slug: string;
    title: string;
    city: string;
    company: {
      id: number;
      name: string;
      logoUrl: string | null;
    };
    category: string;
    salaryMin: number;
    salaryMax: number;
    tags: string[];
    rating?: number;
  };
}

interface DecodedToken {
  id: number;
  userId: number;
  [key: string]: any;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/go-to-signin");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.userId;

      const res = await apiCall.get(`/save/user/${userId}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setSavedJobs(res.data.data || []);
      setTotal(res.data.pagination?.total || res.data.data.length || 0);
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, [page]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setSavedJobs((prev) =>
      [...prev].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      })
    );
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
    <div className="bg-background min-h-screen">
      <Container className="py-10 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#467EC7]">Saved Jobs</h1>
          <button
            onClick={toggleSortOrder}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title={`Sort ${sortOrder === "asc" ? "Descending" : "Ascending"}`}
          >
            {sortOrder === "asc" ? (
              <ArrowUpDown className="w-5 h-5 text-[#467EC7]" />
            ) : (
              <ArrowDownUp className="w-5 h-5 text-[#467EC7]" />
            )}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="w-8 h-8 text-[#24CFA7]" />
            </motion.div>
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="min-h-[75vh] flex items-center justify-center">
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
                <SearchX size={48} color="#24CFA7" /> No saved jobs.
              </h3>
              <p className="text-muted-foreground">
                You haven't saved any jobs yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Grid of JobCards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((savedJob) => {
                const job = savedJob.job;
                return (
                  <JobCard
                    key={savedJob.id}
                    id={job.id}
                    slug={job.slug}
                    title={job.title}
                    company={job.company.name}
                    logo={job.company.logoUrl || ""}
                    city={job.city}
                    salary={`${job.salaryMin}-${job.salaryMax}`}
                    category={job.category}
                    tags={job.tags}
                    rating={job.rating || 0}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
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
          </>
        )}
      </Container>
    </div>
  );
}
