"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { getCityFromCoords, getUserLocation } from "@/lib/utils/locationUtils";

type Filters = {
  keyword?: string;
  location?: string;
  sort?: "name" | "jobsCount";
  order?: "asc" | "desc";
};

export function useCompaniesPage() {
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

  // Parse query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const keyword = params.get("keyword") || "";
    const city = params.get("city") || "";
    const pageParam = parseInt(params.get("page") || "1", 10);
    const order = (params.get("order") as "asc" | "desc") || "asc";
    const sort = (params.get("sort") as "name" | "jobsCount") || "name";

    setSearchInputs({ keyword, location: city });
    setFilters((prev) => ({ ...prev, keyword, location: city, sort, order }));
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
          sort: filters.sort,
          order: filters.order,
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
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.order) params.set("order", filters.order);
    if (page > 1) params.set("page", page.toString());

    const newUrl = `/explore/companies${
      params.toString() ? "?" + params.toString() : ""
    }`;
    if (window.location.pathname + window.location.search !== newUrl) {
      router.replace(newUrl);
    }
  }, [filters, page]);

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

  const handleSortChange = (sort: "name" | "jobsCount") => {
    setFilters((prev) => ({
      ...prev,
      sort,
      order: prev.sort === sort && prev.order === "asc" ? "desc" : "asc",
    }));
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    loading,
    viewMode,
    filters,
    page,
    companies,
    total,
    error,
    searchInputs,
    setSearchInputs,
    handleSearch,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    totalPages,
  };
}
