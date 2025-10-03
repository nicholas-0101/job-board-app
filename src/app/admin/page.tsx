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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { listCompanyJobs } from "@/lib/jobs";
import { listCompanyInterviews } from "@/lib/interviews";
import { apiCall } from "@/helper/axios";

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
    return raw ? Number(raw) : NaN;
  })[0];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Ensure valid companyId (fetch from backend if not present)
      let cid = companyId;
      if (!cid || Number.isNaN(cid)) {
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const resolved = Number(data?.id ?? data?.data?.id);
          if (resolved) {
            cid = resolved;
            localStorage.setItem("companyId", cid.toString());
          }
        } catch {}
      }

      if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

      let jobsResponse, interviewsResponse;
      try {
        [jobsResponse, interviewsResponse] = await Promise.all([
          listCompanyJobs({ companyId: cid, limit: 100, offset: 0 }),
          listCompanyInterviews({ companyId: cid, limit: 100, offset: 0 })
        ]);
      } catch (e: any) {
        // Fallback in case stale companyId (e.g., 16) is stored
        try {
          const resp = await apiCall.get("/company/admin");
          const data = resp.data?.data ?? resp.data;
          const newCid = Number(data?.id ?? data?.data?.id);
          if (newCid && newCid !== cid) {
            localStorage.setItem("companyId", newCid.toString());
            cid = newCid;
            [jobsResponse, interviewsResponse] = await Promise.all([
              listCompanyJobs({ companyId: cid, limit: 100, offset: 0 }),
              listCompanyInterviews({ companyId: cid, limit: 100, offset: 0 })
            ]);
          } else {
            throw e;
          }
        } catch {
          throw e;
        }
      }

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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your job board platform</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={fetchDashboardData} disabled={loading} className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/admin/jobs/new">
                <Button className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c]">
                  <Plus className="w-5 h-5" />
                  Post New Job
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Features Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Admin Features</h2>
          <p className="text-sm text-muted-foreground">Access all administrative functions for your job board platform</p>
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
                <Card className="h-full cursor-pointer group hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center text-primary font-medium">
                      <span>Access Feature</span>
                      <motion.div className="ml-2" animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        →
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Link href="/admin/jobs/new">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Card>
                  <CardContent className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                        <h4 className="font-medium">Create New Job</h4>
                        <p className="text-sm text-muted-foreground">Post a new job opening</p>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/admin/jobs">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Card>
                  <CardContent className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                        <h4 className="font-medium">Manage Jobs</h4>
                        <p className="text-sm text-muted-foreground">View and edit job postings</p>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/admin/applicants">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Card>
                  <CardContent className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                        <h4 className="font-medium">Manage Applicants</h4>
                        <p className="text-sm text-muted-foreground">Review and manage applicants</p>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/admin/interviews">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Card>
                  <CardContent className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                        <h4 className="font-medium">Schedule Interview</h4>
                        <p className="text-sm text-muted-foreground">Manage interview sessions</p>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/admin/preselection">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Card>
                  <CardContent className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TestTube className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                        <h4 className="font-medium">Pre-Selection Tests</h4>
                        <p className="text-sm text-muted-foreground">Manage applicant tests</p>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>

            <Link href="/admin/analytics">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
                <Card>
                  <CardContent className="p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                        <h4 className="font-medium">View Analytics</h4>
                        <p className="text-sm text-muted-foreground">Check platform insights</p>
                  </div>
                </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-semibold">
                        <AnimatedCounter end={stat.value} />
                      </p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
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
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-1 rounded-xl shadow-sm mb-8 border overflow-x-auto">
          {["overview", "jobs", "applicants", "interviews", "analytics"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "ghost"}
              className="flex-1 capitalize whitespace-nowrap"
            >
              {tab}
            </Button>
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
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="text" placeholder="Search jobs..." className="pl-9" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Job Postings List */}
              <Card>
                <CardContent className="p-0 overflow-hidden">
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
                </CardContent>
              </Card>
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
                  <Card
                    key={applicant.id}
                    className="hover:shadow-md transition-all"
                  >
                    <CardContent className="p-6">
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
                            <Button variant="ghost" className="text-green-600 hover:bg-green-50">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                              <Calendar className="w-4 h-4" />
                            </Button>
                        </div>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
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
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start">
                      <Plus className="w-5 h-5 mr-2" />
                      Post New Job
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
