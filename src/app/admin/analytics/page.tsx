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
import { TimeRangeSelector } from "./components/TimeRangeSelector";
import { OverviewStatCard } from "./components/OverviewStatCard";
import { DemographicsSection } from "./components/DemographicsSection";
import { SalaryTrendsSection } from "./components/SalaryTrendsSection";
import { InterestsGrid } from "./components/InterestsGrid";

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
        <TimeRangeSelector timeRange={timeRange} setTimeRange={setTimeRange} onRefresh={() => window.location.reload()} onExport={exportAnalytics} />
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
              <OverviewStatCard title="Total Users" value={overview?.totalUsers} icon={Users} color="from-blue-500 to-blue-600" />
              <OverviewStatCard title="Active Jobs" value={overview?.activeJobs} icon={Briefcase} color="from-green-500 to-green-600" />
              <OverviewStatCard title="Applications" value={overview?.applications} icon={TrendingUp} color="from-purple-500 to-purple-600" />
              <OverviewStatCard title="Companies" value={overview?.companies} icon={Target} color="from-orange-500 to-orange-600" />
            </div>

            <DemographicsSection demographics={demographics} />

            <SalaryTrendsSection salaryTrends={salaryTrends} />

            <InterestsGrid interests={interests} />
          </>
        )}
      </div>
    </div>
  );
}
