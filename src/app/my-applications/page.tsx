"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { apiCall } from "@/helper/axios";
import Container from "@/components/common/Container";
import {
  Briefcase,
  Building2,
  Loader,
  SearchX,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowDownUp,
} from "lucide-react";

interface Job {
  id: number;
  slug: string;
  title: string;
  city: string;
  category: string;
  salaryMin: number;
  salaryMax: number;
  company: {
    id: number;
    name: string;
    logo: string | null;
  };
}

interface Application {
  id: number;
  cvUrl: string;
  expectedSalary: number;
  status: string;
  reviewNote?: string;
  job: Job;
  createdAt: string;
}

interface DecodedToken {
  id: number;
  userId: number;
  [key: string]: any;
}

export default function MyApplicationsPage() {
  enum ApplicationStatus {
    SUBMITTED = "SUBMITTED",
    IN_REVIEW = "IN_REVIEW",
    INTERVIEW = "INTERVIEW",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
  }

  const statusStyles: Record<ApplicationStatus, string> = {
    [ApplicationStatus.SUBMITTED]: "bg-blue-100 text-blue-900",
    [ApplicationStatus.IN_REVIEW]: "bg-yellow-100 text-yellow-900",
    [ApplicationStatus.INTERVIEW]: "bg-purple-100 text-purple-900",
    [ApplicationStatus.ACCEPTED]: "bg-green-100 text-green-900",
    [ApplicationStatus.REJECTED]: "bg-red-100 text-red-900",
  };

  const formatStatus = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.IN_REVIEW:
        return "IN REVIEW";
      case ApplicationStatus.INTERVIEW:
        return "INTERVIEW";
      case ApplicationStatus.ACCEPTED:
        return "ACCEPTED";
      case ApplicationStatus.REJECTED:
        return "REJECTED";
      default:
        return "SUBMITTED";
    }
  };

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/go-to-signin");
        return;
      }

      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.userId;

      const res = await apiCall.get(`/application/user/${userId}`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch applications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [page]);

  const formatIDR = (value: number) =>
    `IDR ${new Intl.NumberFormat("id-ID").format(value)}`;

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setApplications((prev) =>
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
    <div className="bg-background">
      <Container className="py-10 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#467EC7]">My Applications</h1>
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
          <div className="flex items-center justify-center py-30">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader className="w-8 h-8 text-[#24CFA7]" />
            </motion.div>
          </div>
        ) : applications.length === 0 ? (
          <div className="min-h-[75vh] flex items-center justify-center">
            <div className="text-center py-20">
              <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
                <SearchX size={48} color="#24CFA7" /> No applications found.
              </h3>
              <p className="text-muted-foreground">
                You haven't applied to any jobs yet.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#F0F5F9] rounded-xl p-6 relative"
                >
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        statusStyles[app.status as ApplicationStatus] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formatStatus(app.status as ApplicationStatus)}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#467EC7] mb-2">
                    {app.job.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1 flex gap-2 items-center">
                    <Building2 size={18} /> {app.job.company.name} •{" "}
                    {app.job.city}
                  </p>
                  <p className="text-sm text-gray-500 mb-4 flex gap-2 items-center">
                    <Briefcase size={18} /> {app.job.category} •{" "}
                    {formatIDR(app.job.salaryMin)} –{" "}
                    {formatIDR(app.job.salaryMax)}
                  </p>

                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Expected Salary:</span>{" "}
                      {formatIDR(app.expectedSalary)}
                    </p>
                    <p>
                      <span className="font-medium">CV:</span>{" "}
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#467EC7] underline"
                      >
                        View CV
                      </a>
                    </p>
                    {app.reviewNote && (
                      <div className="mt-2 p-3 bg-[#E6F5F1] text-[#0F766E] rounded-lg text-sm border border-[#24CFA7]">
                        <span className="font-medium">Review Note:</span>{" "}
                        {app.reviewNote}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={() =>
                        router.push(`/explore/jobs/${app.job.slug}`)
                      }
                      className="px-4 py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-sm font-medium transition-colors cursor-pointer"
                    >
                      View Job Details
                    </button>
                  </div>
                </motion.div>
              ))}
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
