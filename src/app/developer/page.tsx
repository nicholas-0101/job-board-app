"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "./components/DeveloperLayout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { StatsCards } from "./components/StatsCards";
import { DeveloperTools } from "./components/DeveloperTools";

export default function DeveloperPage() {
  const [stats, setStats] = useState({
    totalAssessments: 0,
    pendingApprovals: 0,
    certificatesIssued: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Simulate loading stats (replace with actual API call)
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      // Simulate API delay
      setTimeout(() => {
        setStats({
          totalAssessments: 25,
          pendingApprovals: 8,
          certificatesIssued: 142,
        });
        setStatsLoading(false);
      }, 1000);
    };
    
    fetchStats();
  }, []);

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="min-h-screen py-6" style={{ backgroundColor: '#F0F5F9' }}>
          <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="bg-white shadow-lg rounded-lg" style={{ borderColor: '#E1F1F3' }}>
              <div className="px-6 py-8">
                <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
                  <div className="w-full sm:w-auto text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-[#467EC7]">
                      Developer Dashboard
                    </h1>
                    <p className="text-lg text-gray-600 mt-2">
                      Manage skill assessments, subscription approvals, and system configurations
                    </p>
                  </div>
                  <div className="flex gap-3 flex-wrap w-full sm:w-auto justify-center sm:justify-end">
                    <Button className="text-white w-full sm:w-auto" style={{ backgroundColor: '#467EC7' }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Assessment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <section className="space-y-10">
              {/* Stats Cards */}
              <StatsCards stats={stats} statsLoading={statsLoading} />

              <div className="space-y-6">
                {/* Developer Tools */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Developer Tools
                  </h2>
                </div>

                <DeveloperTools />
              </div>
            </section>
          </div>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
