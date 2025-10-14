"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { getCityFromCoords, getUserLocation } from "@/lib/utils/locationUtils";

type Filters = {
  keyword?: string;
  location?: string;
  sort?: "createdAt";
  order?: "asc" | "desc";
  postedWithin?: "1" | "3" | "7" | "30";
};

export function useJobsPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    sort: "createdAt",
    order: "desc",
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [jobs, setJobs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showPostedDropdown, setShowPostedDropdown] = useState(false);
  const [searchInputs, setSearchInputs] = useState({
    keyword: "",
    location: "",
  });

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowPostedDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";
    const city = params.get("city") || "";
    const pageParam = parseInt(params.get("page") || "1", 10);
    const order = (params.get("order") as "asc" | "desc") || "desc";
    const sort = (params.get("sort") as "createdAt") || "createdAt";

    setSearchInputs({ keyword, location: city });
    setFilters((prev) => ({ ...prev, keyword, location: city, sort, order }));
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
          postedWithin: filters.postedWithin,
        },
      });

      const jobsData = res.data.data.map((job: any) => ({
        id: job.id,
        slug: job.slug,
        title: job.title,
        company: job.companyName,
        logo: job.companyLogo || "",
        city: job.city,
        salary: job.salary || "",
        category: job.category || "",
        tags: job.tags || [],
        rating: Math.floor(Math.random() * 2) + 4,
        createdAt: job.createdAt,
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
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.order) params.set("order", filters.order);
    if (page > 1) params.set("page", page.toString());

    const newUrl = `/explore/jobs${
      params.toString() ? "?" + params.toString() : ""
    }`;
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl);
    }
  }, [filters, page]);

  useEffect(() => {
    const fetchLocationAndSetFilter = async () => {
      try {
        const pos = await getUserLocation();
        const { latitude, longitude } = pos.coords;
        const { city } = await getCityFromCoords(latitude, longitude);

        if (city && !filters.location) {
          setSearchInputs((prev) => ({ ...prev, location: city }));
          setFilters((prev) => ({ ...prev, location: city }));
        }
      } catch (err) {
        console.warn("User denied location or geolocation failed:", err);
      }
    };

    if (!selectedLocation) {
      fetchLocationAndSetFilter();
    }
  }, []);

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

  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      order: prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleToggleDropdown = () => {
    setShowPostedDropdown((prev) => !prev);
  };

  const handleSelectPostedWithin = (value: "1" | "3" | "7" | "30" | undefined) => {
    setFilters((prev) => ({
      ...prev,
      postedWithin: value,
    }));
    setShowPostedDropdown(false);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    loading,
    viewMode,
    filters,
    page,
    jobs,
    total,
    error,
    searchInputs,
    setSearchInputs,
    showPostedDropdown,
    wrapperRef,
    handleSearch,
    toggleSortOrder,
    handleViewModeChange,
    handlePageChange,
    handleToggleDropdown,
    handleSelectPostedWithin,
    totalPages,
  };
}
