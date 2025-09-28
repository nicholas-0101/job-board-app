"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2,
  Users, Briefcase, Calendar, TrendingUp, DollarSign,
  Clock, MapPin, Star, CheckCircle, XCircle, AlertCircle,
  Settings, BarChart3, FileText, UserCheck, Mail, TestTube,
  RefreshCw, ExternalLink
} from "lucide-react";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { GlowCard } from "../../components/ui/GlowCard";
import { listCompanyJobs } from "@/lib/jobs";
import { listCompanyInterviews } from "@/lib/interviews";

// Dummy data
const jobPostings = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    category: "Engineering",
    location: "Jakarta",
    salary: "20-30M",
    applicants: 23,
    status: "published",
    createdAt: "2024-01-15",
    deadline: "2024-02-15"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    category: "Design",
    location: "Bandung",
    salary: "15-25M",
    applicants: 45,
    status: "draft",
    createdAt: "2024-01-18",
    deadline: "2024-02-18"
  },
  {
    id: 3,
    title: "Product Manager",
    category: "Product",
    location: "Remote",
    salary: "25-35M",
    applicants: 67,
    status: "published",
    createdAt: "2024-01-20",
    deadline: "2024-02-20"
  }
];

const applicants = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    position: "Senior Frontend Engineer",
    expectedSalary: "25M",
    experience: "5 years",
    education: "S1 Computer Science",
    status: "pending",
    appliedAt: "2024-01-22",
    avatar: "👨‍💻"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    position: "UI/UX Designer",
    expectedSalary: "20M",
    experience: "3 years",
    education: "S1 Design",
    status: "interview",
    appliedAt: "2024-01-23",
    avatar: "👩‍🎨"
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState({
    totalJobs: 0,
    publishedJobs: 0,
    totalApplicants: 0,
    totalInterviews: 0
  });

  const companyId = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : 16;
  })[0];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, interviewsResponse] = await Promise.all([
        listCompanyJobs({ companyId, limit: 100, offset: 0 }),
        listCompanyInterviews({ companyId, limit: 100, offset: 0 })
      ]);

      const totalJobs = jobsResponse.total;
      const publishedJobs = jobsResponse.items.filter(job => job.isPublished).length;
      const totalApplicants = jobsResponse.items.reduce((sum, job) => sum + (job.applicantsCount || 0), 0);
      const totalInterviews = interviewsResponse.total;

      setRealStats({
        totalJobs,
        publishedJobs,
        totalApplicants,
        totalInterviews
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Admin Features Menu
  const adminFeatures = [
    {
      title: "Job Management",
      description: "Create, edit, and manage job postings",
      icon: Briefcase,
      color: "from-blue-500 to-blue-600",
      href: "/admin/jobs",
      features: ["Create New Job", "Edit Existing Jobs", "Publish/Unpublish", "View Applications"]
    },
    {
      title: "Pre-Selection Tests",
      description: "Create and manage pre-selection tests for job applicants",
      icon: TestTube,
      color: "from-purple-500 to-purple-600",
      href: "/admin/preselection",
      features: ["Create 25-Question Tests", "Set Passing Scores", "View Test Results", "Auto-Block Applications"]
    },
    {
      title: "Applicant Management",
      description: "Review and manage job applicants",
      icon: Users,
      color: "from-green-500 to-green-600",
      href: "/admin/applicants",
      features: ["View All Applicants", "Filter by Criteria", "Update Status", "View CV Preview"]
    },
    {
      title: "Interview Scheduling",
      description: "Schedule and manage interview sessions",
      icon: Calendar,
      color: "from-orange-500 to-orange-600",
      href: "/admin/interviews",
      features: ["Schedule Interviews", "Email Notifications", "H-1 Reminders", "Multiple Candidates"]
    },
    {
      title: "Analytics Dashboard",
      description: "View comprehensive analytics and insights",
      icon: BarChart3,
      color: "from-indigo-500 to-indigo-600",
      href: "/admin/analytics",
      features: ["User Demographics", "Salary Trends", "Application Insights", "Company Metrics"]
    }
  ];

  const stats = [
    { label: "Total Jobs", value: realStats.totalJobs, icon: Briefcase, color: "from-blue-500 to-blue-600", change: "+2" },
    { label: "Published Jobs", value: realStats.publishedJobs, icon: CheckCircle, color: "from-green-500 to-green-600", change: "+5" },
    { label: "Total Applicants", value: realStats.totalApplicants, icon: Users, color: "from-purple-500 to-purple-600", change: "+15" },
    { label: "Scheduled Interviews", value: realStats.totalInterviews, icon: Calendar, color: "from-orange-500 to-orange-600", change: "+3" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-700 border-green-200";
      case "draft": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "closed": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getApplicantStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "interview": return "bg-blue-100 text-blue-700";
      case "accepted": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your job board platform</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchDashboardData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl shadow-sm hover:bg-gray-200 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </motion.button>
              <Link href="/admin/jobs/new">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D6EFD] text-white font-medium rounded-xl shadow-sm hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5" />
                  Post New Job
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Features</h2>
          <p className="text-gray-600">Access all administrative functions for your job board platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {adminFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={feature.href}>
                <GlowCard className="h-full cursor-pointer group hover:scale-105 transition-transform duration-300">
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                      <span>Access Feature</span>
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>
                </GlowCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Link href="/admin/jobs/new">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Create New Job</h4>
                    <p className="text-sm text-gray-500">Post a new job opening</p>
                  </div>
                </div>
              </motion.button>
            </Link>

            <Link href="/admin/jobs">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Manage Jobs</h4>
                    <p className="text-sm text-gray-500">View and edit job postings</p>
                  </div>
                </div>
              </motion.button>
            </Link>

            <Link href="/admin/applicants">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Manage Applicants</h4>
                    <p className="text-sm text-gray-500">Review and manage applicants</p>
                  </div>
                </div>
              </motion.button>
            </Link>

            <Link href="/admin/interviews">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Schedule Interview</h4>
                    <p className="text-sm text-gray-500">Manage interview sessions</p>
                  </div>
                </div>
              </motion.button>
            </Link>

            <Link href="/admin/preselection">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TestTube className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Pre-Selection Tests</h4>
                    <p className="text-sm text-gray-500">Manage applicant tests</p>
                  </div>
                </div>
              </motion.button>
            </Link>

            <Link href="/admin/analytics">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">View Analytics</h4>
                    <p className="text-sm text-gray-500">Check platform insights</p>
                  </div>
                </div>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <GlowCard key={stat.label} delay={index * 0.1}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter end={stat.value} />
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    {stat.change && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {stat.change} this week
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-white rounded-xl shadow-sm mb-8 border border-gray-200">
          {["overview", "jobs", "applicants", "interviews", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-3 rounded-lg font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-[#0D6EFD] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          {activeTab === "jobs" && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Job Postings Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Job Postings List */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Job Title</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Applicants</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {jobPostings.map((job) => (
                        <motion.tr
                          key={job.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <h3 className="font-semibold text-gray-900">{job.title}</h3>
                              <p className="text-sm text-gray-500">Created {job.createdAt}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{job.category}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-900">{job.applicants}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "applicants" && (
            <motion.div
              key="applicants"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900">Applicant Management</h2>
              
              <div className="grid gap-6">
                {applicants.map((applicant, index) => (
                  <motion.div
                    key={applicant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center text-2xl">
                          {applicant.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{applicant.name}</h3>
                          <p className="text-sm text-gray-600">{applicant.email}</p>
                          <p className="text-sm text-gray-500 mt-1">Applied for: {applicant.position}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>💼 {applicant.experience}</span>
                            <span>🎓 {applicant.education}</span>
                            <span>💰 {applicant.expectedSalary}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getApplicantStatusColor(applicant.status)}`}>
                          {applicant.status}
                        </span>
                        <div className="flex items-center gap-1">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Calendar className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6 md:grid-cols-2"
            >
              <GlowCard>
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">New application received</p>
                      <p className="text-xs text-gray-500">John Doe applied for Frontend Engineer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Interview scheduled</p>
                      <p className="text-xs text-gray-500">Jane Smith - UI/UX Designer position</p>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid gap-3">
                  <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900">Post New Job</p>
                        <p className="text-sm text-gray-500">Create a new job posting</p>
                      </div>
                    </div>
                  </button>
                  <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-secondary-600" />
                      <div>
                        <p className="font-medium text-gray-900">Schedule Interview</p>
                        <p className="text-sm text-gray-500">Set up candidate interviews</p>
                      </div>
                    </div>
                  </button>
                </div>
              </GlowCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
