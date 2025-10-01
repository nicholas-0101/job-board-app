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
import { HomeJobCard } from "./explore/jobs/components/JobCard";
import SearchBar from "../components/site/SearchBar";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";
import { apiCall } from "@/helper/axios";
import { useSearchParams, usePathname } from "next/navigation";
import { getCityFromCoords, getUserLocation } from "@/utils/location";

const categories = [
  { name: "Engineering", icon: "⚙️", count: 234 },
  { name: "Design", icon: "🎨", count: 89 },
  { name: "Marketing", icon: "📈", count: 156 },
  { name: "Sales", icon: "💼", count: 78 },
  { name: "Product", icon: "🚀", count: 45 },
  { name: "Data", icon: "📊", count: 67 },
];

const trustedCompanies = [
  { name: "Google", logo: "🔍" },
  { name: "Microsoft", logo: "🪟" },
  { name: "Apple", logo: "🍎" },
  { name: "Amazon", logo: "📦" },
  { name: "Meta", logo: "👥" },
  { name: "Netflix", logo: "🎬" },
];

export default function HomePage() {
  const router = useRouter();
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const heroRef = useRef(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("city") || ""
  );

  const stats = [
    { label: "Active Jobs", value: 2340, icon: Briefcase },
    { label: "Companies", value: 480, icon: Building2 },
    { label: "Job Seekers", value: 12500, icon: Users },
    { label: "Success Rate", value: 92, icon: Award, suffix: "%" },
  ];

  useEffect(() => {
    // If admin is logged in, redirect root to /admin
    try {
      const role = typeof window !== "undefined" ? localStorage.getItem("role") : null;
      if (role === "ADMIN") {
        router.replace("/admin");
        return;
      }
    } catch {}

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
  }, []);

  const handleSearch = useCallback(
    async (shouldScroll: boolean = true) => {
      try {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (selectedLocation) params.set("city", selectedLocation);

        router.replace(`${pathname}?${params.toString()}`, { scroll: false });

        const res = await apiCall.get("/job/all", {
          params: {
            keyword: keyword || undefined,
            city: selectedLocation || undefined,
          },
        });

        const jobsData = res.data.data.map((job: any) => ({
          id: job.id,
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
    const fetchLocationAndJobs = async () => {
      try {
        const pos = await getUserLocation();
        const { latitude, longitude } = pos.coords;

        const { city } = await getCityFromCoords(latitude, longitude);

        if (city) {
          setSelectedLocation((prev) => prev || city);
        }
      } catch (err) {
        console.warn("User denied location or geolocation failed:", err);
      }
    };

    fetchLocationAndJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-background">
      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[100vh] bg-grit overflow-hidden"
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

        <div className="relative container mx-auto px-4 pt-24 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
              <span className="text-[#467EC7]">Find Your</span>
              <br />
              <span className="text-[#24CFA7]">Dream Career</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with top companies and discover opportunities that match
              your skills, passion, and career goals with workoo
            </p>

            <div className="flex justify-center gap-8 mb-14">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold tracking-tight text-[#467EC7]">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">
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
            className="max-w-4xl mx-auto"
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
      </motion.section>

      {/* Jobs */}
      <section ref={exploreRef} className="container mx-auto px-4 py-16 min-h-[100vh]">
        <div className="text-center mb-12 mt-10">
          <h2 className="text-3xl font-bold text-[#467EC7] mb-2">
            Explore Your Dream Career
          </h2>
          <p className="text-muted-foreground">
            Find career that match your passion
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-30">
            <h3 className="text-xl font-semibold text-[#467EC7] flex flex-col gap-2 items-center justify-center">
              <SearchX size={48} color="#24CFA7" /> No jobs found matching your
              search.
            </h3>
            <p className="text-muted-foreground">
              Try adjusting filters or searching a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.06, 0.24) }}
              >
                <HomeJobCard {...job} />
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/explore/jobs">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#24CFA7] text-primary-foreground font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Explore All Jobs
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gradient-to-br from-secondary-50 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#467EC7] mb-2">
              Explore by Category
            </h2>
            <p className="text-muted-foreground">
              Find opportunities in your field of expertise
            </p>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="bg-[#F0F5F9] rounded-2xl p-6 text-center hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-[#467EC7] mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground/80 font-medium">
                  {category.count} jobs
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Companies */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground mb-8">
          Trusted by professionals from
        </h3>
        <div className="flex justify-center items-center gap-12 flex-wrap">
          {trustedCompanies.map((company) => (
            <div
              key={company.name}
              className="flex items-center gap-2 text-[#A3B6CE] hover:text-[#467EC7] transition-colors"
            >
              <span className="text-3xl">{company.logo}</span>
              <span className="text-xl font-semibold">{company.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
