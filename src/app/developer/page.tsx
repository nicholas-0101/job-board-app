"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "./components/DeveloperLayout";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsSection } from "./components/StatsSection";
import { ToolsSection } from "./components/ToolsSection";
import { useDeveloperStats } from "./hooks/useDeveloperStats";
import { COLORS } from "./constants/dashboardConfig";

export default function DeveloperPage() {
  const { stats, isLoading } = useDeveloperStats();

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div
          className="min-h-screen py-6"
        >
          <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
            <DashboardHeader />

            <section className="space-y-10">
              <StatsSection stats={stats} isLoading={isLoading} />
              <ToolsSection />
            </section>
          </div>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
