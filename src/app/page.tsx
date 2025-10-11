"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Users,
  Building2,
  ArrowRight,
  Award,
  SearchX,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { JobCard } from "./explore/jobs/components/JobCard";
import SearchBar from "../components/site/SearchBar";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import { apiCall } from "@/helper/axios";
import { getCityFromCoords, getUserLocation } from "@/lib/utils/locationUtils";

const trustedCompanies = [
  { name: "Google", logo: "🔍", url: "https://www.google.com" },
  { name: "Microsoft", logo: "🪟", url: "https://www.microsoft.com" },
  { name: "Apple", logo: "🍎", url: "https://www.apple.com" },
  { name: "Amazon", logo: "📦", url: "https://www.amazon.com" },
  { name: "Meta", logo: "👥", url: "https://about.meta.com" },
  { name: "Netflix", logo: "🎬", url: "https://www.netflix.com" },
];

export default function HomePage() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  const heroRef = useRef(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [pathname, setPathname] = useState("");

  const stats = [
    { label: "Active Jobs", value: 12340, icon: Briefcase },
    { label: "Companies", value: 7480, icon: Building2 },
    { label: "Job Seekers", value: 62500, icon: Users },
    { label: "Success Rate", value: 96, icon: Award, suffix: "%" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const searchParams = new URLSearchParams(window.location.search);
    setKeyword(searchParams.get("keyword") || "");
    setSelectedLocation(searchParams.get("city") || "");
    setPathname(window.location.pathname);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    // Only redirect admin, let regular users access homepage
    try {
      const role = localStorage.getItem("role");
      if (role === "ADMIN") {
        router.replace("/admin");
        return;
      }
    } catch { }

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
  }, [keyword, selectedLocation, mounted, router]);

  const handleSearch = useCallback(
    async (shouldScroll: boolean = true) => {
      if (!pathname) return;

      try {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (selectedLocation) params.set("city", selectedLocation);

        const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""
          }`;
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

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24CFA7]"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-secondary-50 to-background">
      {/* Hero */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[95vh] bg-grit overflow-hidden bg-gradient-to-br from-[#467EC7]/15 via-white to-[#24CFA7]/25"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-10 md:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-14"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-5">
              <span className="text-[#467EC7]">Find Your</span>
              <br />
              <span className="text-[#24CFA7]">Dream Career</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
              Connect with top companies and discover opportunities that match
              your skills, passion, and career goals with workoo
            </p>

            <div className="grid grid-cols-2 sm:flex sm:justify-center gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-14">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#467EC7]">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-4xl mx-auto px-2 sm:px-4 relative z-10"
          >
            <SearchBar
              keyword={keyword}
              setKeyword={setKeyword}
              city={selectedLocation}
              setCity={setSelectedLocation}
              onSearch={handleSearch}
            />
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </motion.section>

      {/* Jobs */}
      <section
        ref={exploreRef}
        className="container mx-auto px-4 py-8 sm:py-12 md:py-16 min-h-[100vh]"
      >
        <div className="text-center mb-8 sm:mb-10 md:mb-12 mt-6 sm:mt-8 md:mt-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#467EC7] mb-2">
            Explore Your Dream Career
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Find career that match your passion
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 sm:py-20 md:py-30">
            <h3 className="text-lg sm:text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
              <SearchX size={40} className="sm:w-12 sm:h-12" color="#24CFA7" />
              <span className="px-4">No jobs found matching your search.</span>
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Try adjusting filters or searching a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.06, 0.24) }}
              >
                <JobCard {...job} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <Link href="/explore/jobs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#24CFA7] text-primary-foreground font-semibold rounded-xl hover:shadow-lg transition-all text-sm sm:text-base"
            >
              Explore All Jobs
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="relative container mx-auto px-4 py-8 sm:py-12 md:py-16 text-center bg-gradient-to-br from-[#467EC7]/25 via-white/90 to-[#24CFA7]/10">
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-b from-white via-transparent to-transparent pointer-events-none" />

        <h3 className="text-base sm:text-lg font-semibold text-muted-foreground mb-6 sm:mb-8">
          Trusted by professionals from
        </h3>
        <div className="grid grid-cols-2 sm:flex sm:justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 flex-wrap">
          {trustedCompanies.map((company) => (
            <a
              key={company.name}
              href={company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 text-[#A3B6CE] hover:text-[#467EC7] transition-colors justify-center sm:justify-start"
            >
              <span className="text-2xl sm:text-3xl">{company.logo}</span>
              <span className="text-sm sm:text-lg md:text-xl font-semibold">{company.name}</span>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
