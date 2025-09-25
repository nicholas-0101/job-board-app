"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Briefcase,
  Users,
  Building2,
  ArrowRight,
  Award,
  Rocket,
  Brain,
} from "lucide-react";
import { useState, useRef } from "react";
import { ModernJobCard } from "../components/ui/ModernJobCard";
import SearchBarPro from "../components/jobboard/SearchBarPro";
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
    rating: 4.8,
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
    rating: 4.5,
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
    rating: 4.7,
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
    rating: 4.6,
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
    rating: 4.4,
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
    offset: ["start start", "end start"],
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
    {
      label: "Active Jobs",
      value: 2340,
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Companies",
      value: 480,
      icon: Building2,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Job Seekers",
      value: 12500,
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Success Rate",
      value: 92,
      icon: Award,
      suffix: "%",
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-background">
      {/* Hero Section with Parallax */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-[85vh] overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
          {/* Subtle grid pattern */}
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
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-5">
              <span className="text-[#467EC7]">Find Your</span>
              <br />
              <span className="text-[#24CFA7]">Dream Career</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Connect with top companies and discover opportunities that match
              your skills, passion, and career goals with workoo
            </p>

            {/* Stats Row */}
            <div className="flex justify-center gap-8 mb-14">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold tracking-tight text-[#467EC7]">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pro Search Bar (unified) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <SearchBarPro />
          </motion.div>
        </div>
      </motion.section>

      {/* Jobs Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Section Header */}
          <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Explore Your Dream Career
              </h2>
              <p className="text-muted-foreground">
                Find career that match your passion 
              </p>
            </div>

          {/* Job Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {enhancedJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(index * 0.06, 0.24) }}
              >
                <ModernJobCard
                  {...job}
                  applicants={job.applicants}
                  isHot={Boolean(job.isHot)}
                />
              </motion.div>
            ))}
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link href="/explore/jobs">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#467EC7] text-primary-foreground font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Explore All Jobs
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="bg-gradient-to-br from-secondary-50 to-background py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Explore by Category
              </h2>
              <p className="text-muted-foreground">
                Find opportunities in your field of expertise
              </p>
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
                  className="bg-[#F0F5F9] rounded-2xl p-6 text-center hover:shadow-xl transition-all cursor-pointer"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-[#467EC7] mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground/80 font-medium">
                    {category.count} jobs
                  </p>
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
          <h3 className="text-lg font-semibold text-muted-foreground mb-8">
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
                className="flex items-center gap-2 text-[#A3B6CE] hover:text-[#467EC7] transition-colors"
              >
                <span className="text-3xl">{company.logo}</span>
                <span className="text-xl font-semibold">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
