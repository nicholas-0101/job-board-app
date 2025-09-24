"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobCard } from "../../../components/jobs/JobCard";
import { AdvancedFilters } from "../../../components/ui/AdvancedFilters";
import { Search, MapPin, Briefcase, TrendingUp, Grid3x3, List, Loader2, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-4">Find Your Dream Job</h1>
            <p className="text-xl text-blue-100 mb-8">Discover {filteredItems.length}+ opportunities from top companies</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies, or keywords..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 bg-white/95 backdrop-blur-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                />
                <motion.button
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AdvancedFilters />
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="salary-high">Highest Salary</option>
              <option value="salary-low">Lowest Salary</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{paginatedItems.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{filteredItems.length}</span> jobs
          </p>
          <motion.div
            className="flex items-center gap-2 text-sm text-green-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>New jobs added daily</span>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-8 h-8 text-blue-600" />
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
                className={`grid gap-6 ${
                  viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                }`}
              >
                {paginatedItems.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <JobCard {...job} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            <motion.div
              className="mt-12 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
}
