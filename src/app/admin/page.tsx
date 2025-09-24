"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2,
  Users, Briefcase, Calendar, TrendingUp, DollarSign,
  Clock, MapPin, Star, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { GlowCard } from "../../components/ui/GlowCard";

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

  const stats = [
    { label: "Total Jobs", value: 12, icon: Briefcase, color: "from-blue-500 to-blue-600", change: "+2" },
    { label: "Active Applications", value: 89, icon: Users, color: "from-green-500 to-green-600", change: "+15" },
    { label: "Interviews Scheduled", value: 23, icon: Calendar, color: "from-purple-500 to-purple-600", change: "+5" },
    { label: "Avg. Response Time", value: 2.5, icon: Clock, color: "from-orange-500 to-orange-600", suffix: "h" }
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
              <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your job postings and applications</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddJobModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D6EFD] text-white font-medium rounded-xl shadow-sm hover:opacity-90 transition"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </motion.button>
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
                      <AnimatedCounter end={stat.value} suffix={stat.suffix} />
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
