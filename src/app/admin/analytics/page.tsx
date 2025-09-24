"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, DollarSign, Briefcase, MapPin, 
  Calendar, BarChart3, PieChart, Activity, Target,
  ArrowUp, ArrowDown, Filter, Download, RefreshCw
} from "lucide-react";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { GlowCard } from "../../../components/ui/GlowCard";

const analyticsData = {
  overview: {
    totalUsers: 15420,
    activeJobs: 1240,
    applications: 8950,
    companies: 480,
    growth: {
      users: 12.5,
      jobs: 8.3,
      applications: 15.7,
      companies: 5.2
    }
  },
  demographics: {
    ageGroups: [
      { range: "18-24", count: 3850, percentage: 25 },
      { range: "25-30", count: 5390, percentage: 35 },
      { range: "31-35", count: 3080, percentage: 20 },
      { range: "36-40", count: 1850, percentage: 12 },
      { range: "40+", count: 1250, percentage: 8 }
    ],
    gender: [
      { type: "Male", count: 8750, percentage: 57 },
      { type: "Female", count: 6200, percentage: 40 },
      { type: "Other", count: 470, percentage: 3 }
    ],
    locations: [
      { city: "Jakarta", count: 6200, percentage: 40 },
      { city: "Bandung", count: 2310, percentage: 15 },
      { city: "Surabaya", count: 1850, percentage: 12 },
      { city: "Yogyakarta", count: 1540, percentage: 10 },
      { city: "Medan", count: 1230, percentage: 8 },
      { city: "Others", count: 2290, percentage: 15 }
    ]
  },
  salaryTrends: {
    byPosition: [
      { position: "Software Engineer", min: 8000000, max: 25000000, avg: 15000000, count: 450 },
      { position: "Product Manager", min: 12000000, max: 35000000, avg: 22000000, count: 180 },
      { position: "UI/UX Designer", min: 6000000, max: 20000000, avg: 12000000, count: 320 },
      { position: "Data Scientist", min: 10000000, max: 30000000, avg: 18000000, count: 150 },
      { position: "DevOps Engineer", min: 9000000, max: 28000000, avg: 17000000, count: 120 }
    ],
    byLocation: [
      { city: "Jakarta", avg: 18500000, growth: 8.5 },
      { city: "Bandung", avg: 14200000, growth: 12.3 },
      { city: "Surabaya", avg: 13800000, growth: 6.7 },
      { city: "Yogyakarta", avg: 11500000, growth: 15.2 },
      { city: "Medan", avg: 12800000, growth: 9.8 }
    ]
  },
  applicantInterests: [
    { category: "Technology", applications: 3200, percentage: 36 },
    { category: "Finance", applications: 1800, percentage: 20 },
    { category: "Healthcare", applications: 1200, percentage: 13 },
    { category: "Education", applications: 980, percentage: 11 },
    { category: "E-commerce", applications: 850, percentage: 10 },
    { category: "Others", applications: 920, percentage: 10 }
  ]
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("users");

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <GlowCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            <AnimatedCounter end={value} />
          </p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}>
            {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span>{Math.abs(change)}% vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </GlowCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Comprehensive insights into platform performance</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={analyticsData.overview.totalUsers}
            change={analyticsData.overview.growth.users}
            icon={Users}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Jobs"
            value={analyticsData.overview.activeJobs}
            change={analyticsData.overview.growth.jobs}
            icon={Briefcase}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Applications"
            value={analyticsData.overview.applications}
            change={analyticsData.overview.growth.applications}
            icon={TrendingUp}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Companies"
            value={analyticsData.overview.companies}
            change={analyticsData.overview.growth.companies}
            icon={Target}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Demographics Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Age Demographics */}
          <GlowCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Age Demographics
            </h3>
            <div className="space-y-4">
              {analyticsData.demographics.ageGroups.map((group, index) => (
                <div key={group.range} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500" style={{ 
                      backgroundColor: `hsl(${220 + index * 20}, 70%, 50%)` 
                    }} />
                    <span className="text-gray-700">{group.range} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${group.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{group.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Gender Distribution */}
          <GlowCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-600" />
              Gender Distribution
            </h3>
            <div className="space-y-4">
              {analyticsData.demographics.gender.map((item, index) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ 
                      backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#EC4899' : '#6B7280'
                    }} />
                    <span className="text-gray-700">{item.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#EC4899' : '#6B7280'
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Location Distribution */}
          <GlowCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Top Locations
            </h3>
            <div className="space-y-4">
              {analyticsData.demographics.locations.map((location, index) => (
                <div key={location.city} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" style={{ 
                      backgroundColor: `hsl(${120 + index * 15}, 60%, 50%)` 
                    }} />
                    <span className="text-gray-700">{location.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${location.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{location.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Salary Trends */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Salary by Position */}
          <GlowCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              Average Salary by Position
            </h3>
            <div className="space-y-4">
              {analyticsData.salaryTrends.byPosition.map((position, index) => (
                <div key={position.position} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{position.position}</h4>
                    <span className="text-sm text-gray-500">{position.count} reports</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      IDR {(position.min / 1000000).toFixed(0)}M - {(position.max / 1000000).toFixed(0)}M
                    </span>
                    <span className="font-semibold text-green-600">
                      Avg: IDR {(position.avg / 1000000).toFixed(0)}M
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(position.avg / 35000000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>

          {/* Salary by Location */}
          <GlowCard>
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Salary Trends by Location
            </h3>
            <div className="space-y-4">
              {analyticsData.salaryTrends.byLocation.map((location, index) => (
                <div key={location.city} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{location.city}</h4>
                    <div className={`flex items-center gap-1 text-sm ${
                      location.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {location.growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {location.growth}%
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      IDR {(location.avg / 1000000).toFixed(1)}M
                    </span>
                    <span className="text-sm text-gray-500">Average</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(location.avg / 25000000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlowCard>
        </div>

        {/* Applicant Interests */}
        <GlowCard>
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            Most Popular Job Categories
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsData.applicantInterests.map((interest, index) => (
              <motion.div
                key={interest.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter end={interest.applications} />
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{interest.category}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${interest.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium text-red-600">{interest.percentage}%</div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlowCard>
      </div>
    </div>
  );
}
