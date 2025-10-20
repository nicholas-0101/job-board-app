"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, DollarSign, Briefcase, MapPin, 
  Calendar, BarChart3, PieChart, Activity, Target,
  ArrowUp, ArrowDown, Filter, Download, RefreshCw,
  Clock, Zap, Smartphone, Monitor, Eye, MousePointer
} from "lucide-react";
import { AnimatedCounter } from "../../../components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getOverview, getDemographics, getSalaryTrends, getInterests } from "@/lib/analytics";
import { apiCall } from "@/helper/axios";


const clampPercentage = (value: number) =>
  Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
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

  const exportAnalytics = () => {
    const data = {
      overview,
      demographics,
      salaryTrends,
      interests,
      exportedAt: new Date().toISOString(),
      timeRange,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number;
    icon: any;
    color: string;
  }) => (
    <Card className="shadow-md">
      <CardContent className="flex flex-col items-center gap-3 p-5 text-center sm:p-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
        >
          <Icon className="h-6 w-6 text-white" aria-hidden />
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="text-3xl font-semibold text-foreground">
          <AnimatedCounter end={typeof value === "number" ? value : Number(value ?? 0)} />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative z-10 border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold truncate">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">Comprehensive insights into platform performance</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Button 
                className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => exportAnalytics()}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-0 container mx-auto px-4 py-8">
        {/* Time Range Filter (moved below header) */}
        <div className="mt-2 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label htmlFor="timeRange" className="text-sm text-muted-foreground">
              Time range
            </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border rounded-md bg-background"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
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
                icon={Users}
                color="from-blue-500 to-blue-600"
              />
              <StatCard
                title="Active Jobs"
                value={overview?.activeJobs}
                icon={Briefcase}
                color="from-green-500 to-green-600"
              />
              <StatCard
                title="Applications"
                value={overview?.applications}
                icon={TrendingUp}
                color="from-purple-500 to-purple-600"
              />
              <StatCard
                title="Companies"
                value={overview?.companies}
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
              {demographics?.ageBuckets && Object.keys(demographics.ageBuckets).length > 0 ? (() => {
                const total = Object.values(demographics.ageBuckets).reduce((sum: number, count) => sum + (count as number), 0) || 1;
                return Object.entries(demographics.ageBuckets)
                  .filter(([range]) => range !== 'unknown')
                  .map(([range, count], index: number) => {
                    const percentage = Math.round(((count as number) * 100) / total);
                    return (
                      <div key={range} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500" style={{ 
                            backgroundColor: `hsl(${220 + index * 20}, 70%, 50%)` 
                          }} />
                          <span className="text-gray-700">{range} years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">{percentage}%</span>
                        </div>
                      </div>
                    );
                  });
              })() : (
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
              {demographics?.gender && Array.isArray(demographics.gender) && demographics.gender.length > 0 ? (() => {
                const total = demographics.gender.reduce((sum: number, item: any) => sum + (item.count || 0), 0) || 1;
                return demographics.gender.map((item: any) => {
                  const percentage = clampPercentage((item.count * 100) / total);
                  const color =
                    item.gender.toLowerCase() === "male"
                      ? "#3B82F6"
                      : item.gender.toLowerCase() === "female"
                      ? "#EC4899"
                      : "#6B7280";
                  return (
                    <div
                      key={item.gender}
                      className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center"
                    >
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate capitalize">{item.gender}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: color }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-semibold text-gray-900">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  );
                });
              })() : (
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
              {demographics?.locations && Array.isArray(demographics.locations) && demographics.locations.length > 0 ? (() => {
                const total = demographics.locations.reduce((sum: number, loc: any) => sum + (loc.count || 0), 0) || 1;
                return demographics.locations.slice(0, 6).map((location: any, index: number) => {
                  const percentage = clampPercentage((location.count * 100) / total);
                  return (
                    <div key={location.city} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px] sm:items-center">
                      <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: `hsl(${120 + index * 15}, 60%, 50%)` }}
                        />
                        <span className="truncate">{location.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-green-500 transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-semibold text-gray-900">{Math.round(percentage)}%</span>
                      </div>
                    </div>
                  );
                });
              })() : (
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
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-500"
                          style={{ width: `${clampPercentage((location.avg / 25000000) * 100)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right text-xs font-semibold text-gray-900">
                        {Math.round(clampPercentage((location.avg / 25000000) * 100))}%
                      </span>
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
