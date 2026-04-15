"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Users,
  Briefcase,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
  BarChart3,
  FileText,
  UserCheck,
  Mail,
  TestTube,
  RefreshCw,
  ExternalLink,
  Building2,
} from "lucide-react";
import { AnimatedCounter } from "../../components/ui/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OverviewHeader } from "./components/OverviewHeader";
import { CompanyBanner } from "./components/CompanyBanner";
import { OverviewStatsGrid } from "./components/OverviewStatsGrid";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export default function AdminPage() {
  const { loading, realStats, companyInfo } = useAdminDashboard();

  const stats = [
    {
      label: "Total Jobs",
      value: realStats.totalJobs,
      icon: Briefcase,
      color: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "Published Jobs",
      value: realStats.publishedJobs,
      icon: CheckCircle,
      color: "bg-emerald-100",
      iconColor: "text-emerald-500",
    },
    {
      label: "Total Applicants",
      value: realStats.totalApplicants,
      icon: Users,
      color: "bg-purple-100",
      iconColor: "text-purple-500",
    },
    {
      label: "Scheduled Interviews",
      value: realStats.totalInterviews,
      icon: Calendar,
      color: "bg-amber-100",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:py-8">
        <OverviewHeader companyInfo={companyInfo} />

        <CompanyBanner companyInfo={companyInfo} />

      <div className="space-y-6">
        <OverviewStatsGrid stats={stats as any} loading={loading} />
      </div>
    </div>
  </div>
);
}
