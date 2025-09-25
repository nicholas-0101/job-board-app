"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Grid3x3, List, Loader2, Sparkles } from "lucide-react";
import NavbarPro from "@/components/site/Navbar";
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
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-8">
        <SearchBarPro />
      </section>

      {/* Filters and Controls */}
      <section className="container mx-auto px-4 pb-12">
        {/* 3-column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filters */}
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>

          {/* Middle: Listings */}
          <div className="lg:col-span-6">
            {/* Controls Row */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{paginatedItems.length}</span> of {filteredItems.length} jobs
              </p>
              <div className="flex items-center gap-2 bg-card text-card-foreground rounded-xl p-1 shadow-sm border border-border">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Loader2 className="w-8 h-8 text-primary" />
                </motion.div>
              </div>
            ) : (
              <>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-xl font-semibold text-foreground">No results found</h3>
                    <p className="text-muted-foreground">Try adjusting filters or searching a different keyword.</p>
                  </div>
                ) : (
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
                )}

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-center gap-2" role="navigation" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground/80 hover:bg-secondary disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl font-medium ${
                          currentPage === i + 1 ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground/80 hover:bg-secondary"
                        }`}
                        aria-current={currentPage === i + 1 ? "page" : undefined}
                        aria-label={`Go to page ${i + 1}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-border bg-card text-foreground/80 hover:bg-secondary disabled:opacity-50"
                    aria-label="Next page"
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
