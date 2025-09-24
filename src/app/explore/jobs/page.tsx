"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3, List, Loader2, Sparkles } from "lucide-react";
import NavbarPro from "@/components/jobboard/NavbarPro";
import SearchBarPro from "@/components/jobboard/SearchBarPro";
import FilterSidebar from "@/components/jobboard/FilterSidebar";
import JobCardPro from "@/components/jobboard/JobCardPro";
import JobDetailPanel from "@/components/jobboard/JobDetailPanel";

const DUMMY = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Senior Frontend Engineer",
    "Backend Developer",
    "UI/UX Designer",
    "Product Manager",
    "Data Scientist",
    "DevOps Engineer"
  ][i % 6],
  company: ["TechNova", "Cloudify", "DesignHub", "DataCorp", "StartupX", "MegaCorp"][i % 6],
  city: ["Jakarta", "Bandung", "Surabaya", "Remote", "Hybrid"][i % 5],
  tags: [
    ["React", "TypeScript", "Next.js", "Tailwind"],
    ["Node.js", "PostgreSQL", "Docker"],
    ["Figma", "Prototyping", "User Research"],
    ["Agile", "Strategy", "Analytics"],
    ["Python", "Machine Learning", "TensorFlow"],
    ["AWS", "Kubernetes", "CI/CD"]
  ][i % 6].slice(0, 3),
  posted: `${(i % 7) + 1}d`,
  salary: `${10 + (i % 4) * 5}M - ${15 + (i % 4) * 5}M`,
  type: ["Full-time", "Part-time", "Contract", "Remote"][i % 4]
}));

export default function JobsPage() {
  const [items, setItems] = useState(DUMMY);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-6">
        <SearchBarPro />
      </section>

      {/* Filters and Controls */}
      <section className="container mx-auto px-4 pb-8">
        {/* 3-column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filters */}
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>

          {/* Middle: Listings */}
          <div className="lg:col-span-6">
            {/* Controls Row */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{paginatedItems.length}</span> of {filteredItems.length} jobs
              </p>
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-[#0D6EFD] text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-[#0D6EFD] text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="w-8 h-8 text-[#0D6EFD]" />
                </motion.div>
              </div>
            ) : (
              <>
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
                        <JobCardPro id={job.id} title={job.title} company={job.company} city={job.city} tags={job.tags} posted={job.posted} salary={job.salary} />
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium ${
                          currentPage === i + 1 ? "bg-[#0D6EFD] text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
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
