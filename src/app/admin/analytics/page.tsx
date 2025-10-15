"use client";
import { useEffect, useState } from "react";
import { Users, Briefcase, TrendingUp, Target, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOverview, getDemographics, getSalaryTrends, getInterests } from "@/lib/analytics";
import { apiCall } from "@/helper/axios";
import { StatCard } from "./components/StatCard";
import { DemographicsSection } from "./components/DemographicsSection";
import { SalaryTrendsSection } from "./components/SalaryTrendsSection";
import { InterestsSection } from "./components/InterestsSection";

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
            <DemographicsSection demographics={demographics} />

            {/* Salary Trends */}
            <SalaryTrendsSection salaryTrends={salaryTrends} />

            {/* Applicant Interests */}
            <InterestsSection interests={interests} />
          </>
        )}
      </div>
    </div>
  );
}
