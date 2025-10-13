"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { getCityFromCoords, getUserLocation } from "@/lib/utils/locationUtils";

interface Job {
  id: number;
  slug: string;
  title: string;
  company: string;
  logo: string | null;
  city: string;
  salary: string;
  category: string;
  tags: string[];
  rating: number;
}

export function useHomePage() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  const exploreRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        router.replace("/admin");
        return;
      }
    } catch {
      // ignore access errors, allow rendering
    }

    setHasAccess(true);
  }, [mounted, router]);

  useEffect(() => {
    if (!hasAccess) return;

    const searchParams = new URLSearchParams(window.location.search);
    setKeyword(searchParams.get("keyword") || "");
    setSelectedLocation(searchParams.get("city") || "");
    setPathname(window.location.pathname);
  }, [hasAccess]);

  useEffect(() => {
    if (!hasAccess) return;

    const fetchJobs = async () => {
      try {
        const res = await apiCall.get("/job/all", {
          params: {
            keyword: keyword || undefined,
            city: selectedLocation || undefined,
          },
        });

        const jobsData = res.data.data.map((job: any) => ({
          id: job.id,
          slug: job.slug,
          title: job.title,
          company: job.companyName,
          logo: job.companyLogo || null,
          city: job.city,
          salary: job.salary,
          category: job.category,
          tags: job.tags || [],
          rating: Math.floor(Math.random() * 2) + 4,
        }));

        setAllJobs(jobsData);
        setJobs(jobsData.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    fetchJobs();
  }, [keyword, selectedLocation, hasAccess, router]);

  const handleSearch = useCallback(
    async (shouldScroll: boolean = true) => {
      if (!hasAccess || !pathname) return;

      try {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (selectedLocation) params.set("city", selectedLocation);

        const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
        if (window.location.pathname + window.location.search !== newUrl) {
          router.replace(newUrl, { scroll: false });
        }

        const res = await apiCall.get("/job/all", {
          params: {
            keyword: keyword || undefined,
            city: selectedLocation || undefined,
          },
        });

        const jobsData = res.data.data.map((job: any) => ({
          id: job.id,
          slug: job.slug,
          title: job.title,
          company: job.companyName,
          logo: job.companyLogo || null,
          city: job.city,
          salary: job.salary,
          category: job.category,
          tags: job.tags || [],
          rating: Math.floor(Math.random() * 2) + 4,
        }));

        setJobs(jobsData.slice(0, 6));

        if (shouldScroll && exploreRef.current) {
          exploreRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    },
    [keyword, selectedLocation, pathname, router]
  );

  useEffect(() => {
    if (!mounted) return;

    const fetchLocationAndJobs = async () => {
      try {
        const pos = await getUserLocation();
        const { latitude, longitude } = pos.coords;

        const { city } = await getCityFromCoords(latitude, longitude);

        if (city && !selectedLocation) {
          setSelectedLocation(city);
        }
      } catch (err) {
        console.warn("User denied location or geolocation failed:", err);
      }
    };

    fetchLocationAndJobs();
  }, [mounted]);

  return {
    jobs,
    mounted,
    hasAccess,
    keyword,
    setKeyword,
    selectedLocation,
    setSelectedLocation,
    handleSearch,
    exploreRef,
  };
}
