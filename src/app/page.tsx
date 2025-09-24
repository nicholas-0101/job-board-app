"use client";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  Search, Briefcase, Users, MapPin, Building2, ArrowRight, 
  Sparkles, TrendingUp, Clock, DollarSign, Star, Shield,
  Award, Target, Zap, Globe, Heart, CheckCircle, Filter,
  ChevronDown, Bookmark, Share2, Eye, Send, Rocket, Brain
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ModernJobCard } from "../components/ui/ModernJobCard";
import { AnimatedCounter } from "../components/ui/AnimatedCounter";

// Enhanced job data with more details
const enhancedJobs = [
  { 
    id: 1, 
    title: "Senior Frontend Engineer", 
    company: "TechNova", 
    logo: "🚀",
    city: "Jakarta", 
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"], 
    posted: "2h", 
    salary: "20-30M",
    type: "Full-time",
    applicants: 23,
    isHot: true,
    rating: 4.8
  },
  { 
    id: 2, 
    title: "Backend Developer", 
    company: "Cloudify", 
    logo: "☁️",
    city: "Bandung", 
    tags: ["Node.js", "PostgreSQL", "Docker", "AWS"], 
    posted: "5h", 
    salary: "15-25M",
    type: "Full-time",
    applicants: 45,
    rating: 4.5
  },
  { 
    id: 3, 
    title: "UI/UX Designer", 
    company: "DesignHub", 
    logo: "🎨",
    city: "Surabaya", 
    tags: ["Figma", "Prototyping", "Research", "Design Systems"], 
    posted: "1d", 
    salary: "12-18M",
    type: "Hybrid",
    applicants: 67,
    isHot: true,
    rating: 4.7
  },
  { 
    id: 4, 
    title: "Product Manager", 
    company: "StartupX", 
    logo: "💡",
    city: "Remote", 
    tags: ["Agile", "Strategy", "Analytics", "Leadership"], 
    posted: "1d", 
    salary: "25-35M",
    type: "Remote",
    applicants: 89,
    rating: 4.6
  },
  { 
    id: 5, 
    title: "Data Scientist", 
    company: "DataCorp", 
    logo: "📊",
    city: "Jakarta", 
    tags: ["Python", "ML", "TensorFlow", "SQL"], 
    posted: "2d", 
    salary: "22-32M",
    type: "Full-time",
    applicants: 34,
    rating: 4.4
  },
];

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

export default function ModernHome() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeJobTab, setActiveJobTab] = useState("recommended");
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  const searchSuggestions = [
    { title: "Frontend Developer", type: "Popular", icon: "🔥" },
    { title: "React Developer Jakarta", type: "Recent", icon: "🕐" },
    { title: "Remote UI/UX Designer", type: "Trending", icon: "📈" },
    { title: "Senior Backend Engineer", type: "High Salary", icon: "💰" },
  ];

  const stats = [
    { label: "Active Jobs", value: 2340, icon: Briefcase, color: "from-blue-500 to-blue-600" },
    { label: "Companies", value: 480, icon: Building2, color: "from-purple-500 to-purple-600" },
    { label: "Job Seekers", value: 12500, icon: Users, color: "from-green-500 to-green-600" },
    { label: "Success Rate", value: 92, icon: Award, suffix: "%", color: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Parallax */}
      <motion.section 
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[85vh] overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
          
          {/* Animated Mesh Gradient */}
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          
          {/* Floating Shapes */}
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full blur-3xl opacity-20"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-secondary-200 to-accent-200 rounded-full blur-3xl opacity-20"
            animate={{
              x: [0, -30, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
          />
        </div>

        <div className="relative container mx-auto px-4 pt-20 pb-10">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-full mb-6"
            >
              <Rocket className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-semibold text-primary-700">
                AI-Powered Job Matching
              </span>
              <span className="px-2 py-0.5 bg-green-500 text-white text-xs rounded-full animate-pulse">
                NEW
              </span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gray-900">Find Your</span>
              <br />
              <motion.span
                className="bg-gradient-to-r from-primary-600 via-secondary-600 to-primary-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200%" }}
              >
                Dream Career
              </motion.span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Connect with top companies and discover opportunities that match your skills, 
              passion, and career goals with our AI-powered platform
            </p>

            {/* Stats Row */}
            <div className="flex justify-center gap-8 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-gray-900">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Advanced Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className={`relative bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
              isSearchFocused ? 'ring-4 ring-primary-100' : ''
            }`}>
              {/* Search Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Smart Job Search</h3>
                    <p className="text-xs text-gray-500">Powered by AI matching</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                  <span className="text-xs text-gray-500">2,340 jobs available</span>
                </div>
              </div>

              {/* Search Fields */}
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Job title or keyword"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all"
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">All Locations</option>
                      <option value="jakarta">Jakarta</option>
                      <option value="bandung">Bandung</option>
                      <option value="surabaya">Surabaya</option>
                      <option value="remote">Remote</option>
                    </select>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Search Jobs
                  </motion.button>
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">Quick filters:</span>
                  {["Remote", "Full-time", "Senior Level", "Startup"].map((filter) => (
                    <motion.button
                      key={filter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1 bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 text-sm rounded-full transition-all"
                    >
                      {filter}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Search Suggestions (shown when focused) */}
              <AnimatePresence>
                {isSearchFocused && keyword.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100"
                  >
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-3">Suggestions</p>
                      {searchSuggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{suggestion.icon}</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{suggestion.title}</p>
                              <p className="text-xs text-gray-500">{suggestion.type}</p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Jobs Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Opportunities
              </h2>
              <p className="text-gray-600">Hand-picked jobs that match your profile</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-xl">
              {["recommended", "latest", "trending"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveJobTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                    activeJobTab === tab
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ModernJobCard {...job} />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <Link href="/explore/jobs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Explore All Jobs
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Explore by Category
              </h2>
              <p className="text-gray-600">Find opportunities in your field of expertise</p>
            </div>

            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 text-center hover:shadow-xl transition-all cursor-pointer border border-gray-100 hover:border-primary-200"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-primary-600 font-medium">{category.count} jobs</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-gray-600 mb-8">
            Trusted by professionals from
          </h3>
          <div className="flex justify-center items-center gap-12 flex-wrap">
            {trustedCompanies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <span className="text-3xl">{company.logo}</span>
                <span className="text-xl font-semibold">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-white overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-6"
            >
              <Brain className="w-4 h-4" />
              <span className="text-sm font-semibold">AI-Powered Matching</span>
            </motion.div>

            <h2 className="text-4xl font-bold mb-4">
              Ready to Find Your Perfect Job?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of professionals who've found their dream careers through our platform
            </p>

            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Get Started Free
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
