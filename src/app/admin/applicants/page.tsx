"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users, Eye, CheckCircle, XCircle, Clock, FileText, Filter,
  Search, Calendar, MapPin, GraduationCap, DollarSign
} from "lucide-react";
import { GlowCard } from "../../../components/ui/GlowCard";

// Mock data for applicants
const mockApplicants = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    jobTitle: "Senior Frontend Developer",
    jobId: 1,
    expectedSalary: 25000000,
    education: "S1 Computer Science",
    age: 28,
    location: "Jakarta",
    status: "SUBMITTED",
    appliedAt: "2024-01-22",
    testScore: 22,
    testPassed: true,
    cvFile: "https://example.com/cv1.pdf",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    jobTitle: "UI/UX Designer",
    jobId: 2,
    expectedSalary: 20000000,
    education: "S1 Design",
    age: 25,
    location: "Bandung",
    status: "INTERVIEW",
    appliedAt: "2024-01-23",
    testScore: 18,
    testPassed: true,
    cvFile: "https://example.com/cv2.pdf",
    profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    jobTitle: "Backend Developer",
    jobId: 3,
    expectedSalary: 30000000,
    education: "S1 Information Technology",
    age: 30,
    location: "Surabaya",
    status: "ACCEPTED",
    appliedAt: "2024-01-20",
    testScore: 24,
    testPassed: true,
    cvFile: "https://example.com/cv3.pdf",
    profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
  }
];

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [selectedJob, setSelectedJob] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Applicants", value: applicants.length, icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Pending Review", value: applicants.filter(a => a.status === "SUBMITTED").length, icon: Clock, color: "from-yellow-500 to-yellow-600" },
    { label: "Interview Stage", value: applicants.filter(a => a.status === "INTERVIEW").length, icon: Calendar, color: "from-purple-500 to-purple-600" },
    { label: "Accepted", value: applicants.filter(a => a.status === "ACCEPTED").length, icon: CheckCircle, color: "from-green-500 to-green-600" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED": return "bg-yellow-100 text-yellow-700";
      case "IN_REVIEW": return "bg-blue-100 text-blue-700";
      case "INTERVIEW": return "bg-purple-100 text-purple-700";
      case "ACCEPTED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const updateStatus = (applicantId: number, newStatus: string) => {
    setApplicants(applicants.map(applicant => 
      applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
    ));
  };

  const filteredApplicants = applicants.filter(applicant => {
    const matchesJob = selectedJob === "all" || applicant.jobId.toString() === selectedJob;
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesJob && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Applicant Management</h1>
              <p className="text-gray-600 mt-1">Review and manage job applicants across all positions</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/jobs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-medium rounded-xl shadow-sm hover:opacity-90 transition"
                >
                  <Users className="w-5 h-5" />
                  Manage Jobs
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard>
                  <div className="p-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                </GlowCard>
              </motion.div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <GlowCard>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Applicants</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, or job..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Position</label>
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Jobs</option>
                    <option value="1">Senior Frontend Developer</option>
                    <option value="2">UI/UX Designer</option>
                    <option value="3">Backend Developer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <Filter className="w-4 h-4 inline mr-2" />
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </GlowCard>
        </div>

        {/* Applicants List */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Applicants ({filteredApplicants.length})</h3>
          <div className="space-y-4">
            {filteredApplicants.map((applicant, index) => (
              <motion.div
                key={applicant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlowCard>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={applicant.profilePicture}
                          alt={applicant.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{applicant.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
                              {applicant.status}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>{applicant.jobTitle}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              <span>{applicant.education}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>Rp {applicant.expectedSalary.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{applicant.location}</span>
                            </div>
                          </div>
                          {applicant.testScore && (
                            <div className="mt-2 text-sm">
                              <span className="text-gray-600">Test Score: </span>
                              <span className={`font-medium ${applicant.testPassed ? 'text-green-600' : 'text-red-600'}`}>
                                {applicant.testScore}/25 {applicant.testPassed ? '(Passed)' : '(Failed)'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={applicant.cvFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Eye className="w-5 h-5" />
                        </a>
                        <div className="flex gap-1">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(applicant.id, "INTERVIEW")}
                            className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition"
                          >
                            Interview
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(applicant.id, "ACCEPTED")}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                          >
                            Accept
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => updateStatus(applicant.id, "REJECTED")}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition"
                          >
                            Reject
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Applicant Management Features</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <GlowCard>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Review & Filter</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>View applicant profiles with photos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Filter by job, status, education</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Search by name, email, or position</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>View pre-selection test scores</span>
                  </li>
                </ul>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Status Management</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Update application status</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Preview CV documents</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Track application timeline</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Bulk status updates</span>
                  </li>
                </ul>
              </div>
            </GlowCard>
          </div>
        </div>
      </div>
    </div>
  );
}
