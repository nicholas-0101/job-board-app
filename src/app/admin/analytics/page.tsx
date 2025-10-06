"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, DollarSign, Briefcase, MapPin, 
  Calendar, BarChart3, PieChart, Activity, Target,
  ArrowUp, ArrowDown, Filter, Download, RefreshCw
} from "lucide-react";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { GlowCard } from "../../../components/ui/GlowCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const analyticsDataFallback = {
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

import { getOverview, getDemographics, getSalaryTrends, getInterests } from "@/lib/analytics";
import { apiCall } from "@/helper/axios";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("users");
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overview, setOverview] = useState<any>(null);
  const [demographics, setDemographics] = useState<any>(null);
  const [salaryTrends, setSalaryTrends] = useState<any>(null);
  const [interests, setInterests] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Resolve companyId if missing/stale
        let cid = companyId;
        if (!cid || Number.isNaN(cid)) {
          try {
            const resp = await apiCall.get("/company/admin");
            const data = resp.data?.data ?? resp.data;
            const resolved = Number(data?.id ?? data?.data?.id);
            if (resolved) {
              cid = resolved;
              localStorage.setItem("companyId", cid.toString());
              setCompanyId(cid);
            }
          } catch {}
        }

        if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

        const [ov, dm, st, it] = await Promise.all([
          getOverview(cid),
          getDemographics(cid),
          getSalaryTrends(cid),
          getInterests(cid),
        ]);
        if (mounted) {
          setOverview(ov);
          setDemographics(dm);
          setSalaryTrends(st);
          setInterests(it);
        }
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load analytics");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [companyId]);

  const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="text-2xl font-semibold">
              {value !== undefined && value !== null ? <AnimatedCounter end={value} /> : <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>}
            </div>
            {change !== undefined && change !== null && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                change >= 0 ? "text-green-600" : "text-red-600"
              }`}>
                {change >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                <span>{Math.abs(change)}% vs last month</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Comprehensive insights into platform performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
              <StatCard
                title="Total Users"
                value={overview?.totalUsers}
                change={overview?.growth?.users}
                icon={Users}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Active Jobs"
                value={overview?.activeJobs}
                change={overview?.growth?.jobs}
                icon={Briefcase}
                color="from-green-500 to-green-600"
              />
              <StatCard
                title="Applications"
                value={overview?.applications}
                change={overview?.growth?.applications}
                icon={TrendingUp}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                title="Companies"
                value={overview?.companies}
                change={overview?.growth?.companies}
                icon={Target}
                color="from-orange-500 to-orange-600"
              />
            </div>

            {/* Demographics Section */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Age Demographics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Users className="w-5 h-5 text-blue-600" />
                Age Demographics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demographics?.ageBuckets && Object.keys(demographics.ageBuckets).length > 0 ? (
                Object.entries(demographics.ageBuckets).map(([range, count], index: number) => {
                  const group = { range, count: count as number, percentage: 0 };
                  return (
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
                        style={{ width: `${group.percentage ?? 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{group.percentage ?? 0}%</span>
                  </div>
                </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-4">No age data available</div>
              )}
            </CardContent>
          </Card>

          {/* Gender Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <PieChart className="w-5 h-5 text-purple-600" />
                Gender Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demographics?.gender && Object.keys(demographics.gender).length > 0 ? (
                Object.entries(demographics.gender).map(([type, count], index: number) => {
                  const item = { type, count: count as number, percentage: 0 };
                  return (
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
                          width: `${item.percentage ?? 0}%`,
                          backgroundColor: index === 0 ? '#3B82F6' : index === 1 ? '#EC4899' : '#6B7280'
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{item.percentage ?? 0}%</span>
                  </div>
                </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-4">No gender data available</div>
              )}
            </CardContent>
          </Card>

          {/* Location Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <MapPin className="w-5 h-5 text-green-600" />
                Top Locations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {demographics?.locations && Array.isArray(demographics.locations) && demographics.locations.length > 0 ? (
                demographics.locations.map((location: any, index: number) => (
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
                        style={{ width: `${location.percentage ?? 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{location.percentage ?? 0}%</span>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">No location data available</div>
              )}
            </CardContent>
          </Card>
        </div>

            {/* Salary Trends */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Salary by Position */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                Average Salary by Position
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {salaryTrends?.byPosition && Array.isArray(salaryTrends.byPosition) && salaryTrends.byPosition.length > 0 ? (
                salaryTrends.byPosition.map((position: any, index: number) => (
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
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">No salary data available</div>
              )}
            </CardContent>
          </Card>

          {/* Salary by Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Salary Trends by Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {salaryTrends?.byLocation && Array.isArray(salaryTrends.byLocation) && salaryTrends.byLocation.length > 0 ? (
                salaryTrends.byLocation.map((location: any, index: number) => (
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
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">No salary trend data available</div>
              )}
            </CardContent>
          </Card>
        </div>

            {/* Applicant Interests */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Activity className="w-5 h-5 text-red-600" />
                  Most Popular Job Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                {interests && Array.isArray(interests) && interests.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {interests.map((interest: any, index: number) => (
                      <motion.div
                        key={interest.category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-xl border hover:shadow-md transition-all bg-card"
                      >
                        <div className="text-center">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            <AnimatedCounter end={interest.applications} />
                          </div>
                          <div className="text-sm text-gray-600 mb-3">{interest.category}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-gradient-to-r from-red-400 to-red-600 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${interest.percentage ?? 0}%` }}
                            />
                          </div>
                          <div className="text-sm font-medium text-red-600">{interest.percentage ?? 0}%</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">No interest data available</div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
