"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Mail, Phone, MapPin, Briefcase, Calendar, Download, Edit2, Check, X, Star, Clock, TrendingUp, Award } from "lucide-react";
import { GlowCard } from "../../components/ui/GlowCard";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  status: "pending" | "reviewing" | "interview" | "rejected" | "accepted";
  appliedDate: string;
  salary: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/150/150");
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "settings">("overview");
  
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812 3456 7890",
    location: "Jakarta, Indonesia",
    title: "Senior Frontend Developer",
    bio: "Passionate developer with 5+ years of experience in React and Next.js",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS"],
  });

  const applications: Application[] = [
    { id: 1, jobTitle: "Senior Frontend Engineer", company: "TechNova", status: "interview", appliedDate: "2024-01-15", salary: "20M - 30M" },
    { id: 2, jobTitle: "Full Stack Developer", company: "Cloudify", status: "reviewing", appliedDate: "2024-01-18", salary: "18M - 25M" },
    { id: 3, jobTitle: "React Developer", company: "StartupX", status: "pending", appliedDate: "2024-01-20", salary: "15M - 22M" },
  ];

  const stats = [
    { label: "Applications", value: 12, icon: Briefcase, color: "from-blue-500 to-blue-600" },
    { label: "Interviews", value: 3, icon: Calendar, color: "from-purple-500 to-purple-600" },
    { label: "Profile Views", value: 234, icon: TrendingUp, color: "from-green-500 to-green-600" },
    { label: "Success Rate", value: 75, icon: Award, color: "from-orange-500 to-orange-600", suffix: "%" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "reviewing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "interview": return "bg-purple-100 text-purple-700 border-purple-200";
      case "rejected": return "bg-red-100 text-red-700 border-red-200";
      case "accepted": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            {/* Profile Image */}
            <div className="relative">
              <motion.div
                className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm p-1"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-gray-700 hover:bg-gray-100">
                  <Camera className="w-4 h-4" />
                </button>
              </motion.div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-blue-100 mb-4">{profile.title}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" /> {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" /> {profile.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profile.location}
                </span>
              </div>
              <div className="mt-4 flex gap-3 justify-center md:justify-start">
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 className="w-4 h-4 inline mr-2" />
                  Edit Profile
                </motion.button>
                <motion.button
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download CV
                </motion.button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              {stats.slice(0, 2).map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tabs */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-2 flex gap-2">
          {["overview", "applications", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {/* Stats Cards */}
              <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => {
                  const IconComponent = stat.icon;
                  return (
                    <GlowCard key={stat.label} delay={i * 0.1}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                          </p>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                        </div>
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </GlowCard>
                  );
                })}
              </div>

              {/* Bio Section */}
              <div className="md:col-span-2">
                <GlowCard>
                  <h3 className="font-semibold text-gray-900 mb-3">About Me</h3>
                  <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
                  
                  <h3 className="font-semibold text-gray-900 mt-6 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </div>

              {/* Recent Activity */}
              <div className="md:col-span-1">
                <GlowCard>
                  <h3 className="font-semibold text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Applied to Frontend Role</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </div>
            </motion.div>
          )}

          {activeTab === "applications" && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {applications.map((app, i) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{app.jobTitle}</h3>
                      <p className="text-gray-600">{app.company}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> {app.appliedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" /> {app.salary}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
