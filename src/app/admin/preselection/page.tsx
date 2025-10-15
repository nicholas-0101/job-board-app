"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listCompanyJobs } from "@/lib/jobs";
import { apiCall } from "@/helper/axios";
import { fetchPreselectionTest } from "@/lib/preselection";
import { StatsOverview } from "@/components/preselection/StatsOverview";
import { TestsList } from "@/components/preselection/TestsList";

type TestSummary = {
  jobId: number;
  jobTitle: string;
  isActive: boolean;
  totalQuestions: number;
  passingScore: number | null;
};

export default function PreselectionPage() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });
  const [loading, setLoading] = useState(true);
  const [tests, setTests] = useState<TestSummary[]>([]);

  useEffect(() => {
    (async () => {
      try {
        // Resolve companyId if needed
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

        // Fetch all jobs then load tests for each
        const jobs = await listCompanyJobs({ companyId: cid, limit: 100, offset: 0 } as any);
        const summaries: TestSummary[] = [];
        for (const j of jobs.items) {
          try {
            const t = await fetchPreselectionTest(j.id);
            // t will be null if no test exists (404)
            summaries.push({
              jobId: j.id,
              jobTitle: j.title,
              isActive: t ? !!t.isActive : false,
              totalQuestions: t?.questions?.length ?? 0,
              passingScore: t?.passingScore ?? null,
            });
          } catch {
            // Handle other errors
            summaries.push({ jobId: j.id, jobTitle: j.title, isActive: false, totalQuestions: 0, passingScore: null });
          }
        }
        setTests(summaries);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Pre-Selection Tests</h1>
              <p className="text-sm text-muted-foreground mt-1">Create and manage 25-question tests for job applicants</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Link href="/admin/jobs">
                <Button variant="outline" className="gap-2 hover:bg-secondary">
                  <Settings className="w-5 h-5" />
                  Manage Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <StatsOverview tests={tests} />

        {/* Tests List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tests by Job Position</h3>
            {tests.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {tests.filter(t=>t.totalQuestions>0).length} of {tests.length} jobs have configured tests
              </p>
            )}
          </div>
          <TestsList tests={tests} loading={loading} />
        </div>
      </div>
    </div>
  );
}

