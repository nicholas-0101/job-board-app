"use client";
import { useEffect, useMemo, useState } from "react";
import { listCompanyJobs } from "@/lib/jobs";
import { apiCall } from "@/helper/axios";
import { fetchPreselectionTest } from "@/lib/preselection";
import { StatsOverview } from "@/components/preselection/StatsOverview";
import { TestsList } from "@/components/preselection/TestsList";
import "@/utils/suppressConsoleErrors";

type TestSummary = {
  jobId: number;
  jobTitle: string;
  isActive: boolean;
  passingScore: number | null;
  totalQuestions: number;
  hasDraft: boolean;
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
        
        // Process jobs in batches to avoid overwhelming the server
        const batchSize = 5;
        for (let i = 0; i < jobs.items.length; i += batchSize) {
          const batch = jobs.items.slice(i, i + batchSize);
          const batchPromises = batch.map(async (j) => {
            try {
              const t = await fetchPreselectionTest(j.id);
              
              // t will be null if no test exists (404)
              if (!t) {
                return { 
                  jobId: j.id, 
                  jobTitle: j.title, 
                  isActive: false, 
                  passingScore: null, 
                  totalQuestions: 0, 
                  hasDraft: false 
                };
              }
              
              return {
                jobId: j.id,
                jobTitle: j.title,
                isActive: !!t.isActive,
                passingScore: t.passingScore ?? null,
                totalQuestions: t.questions?.length ?? 0,
                hasDraft: (t.questions?.length ?? 0) > 0,
              };
            } catch (error) {
              // Silently handle errors (404s are expected for jobs without tests)
              return { jobId: j.id, jobTitle: j.title, isActive: false, passingScore: null, totalQuestions: 0, hasDraft: false };
            }
          });
          
          const batchResults = await Promise.all(batchPromises);
          summaries.push(...batchResults);
          
          // Small delay between batches to reduce server load
          if (i + batchSize < jobs.items.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        setTests(summaries);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  // Add refresh function
  const refresh = () => {
    setLoading(true);
    setTests([]);
    // Trigger re-fetch by updating companyId state
    const raw = localStorage.getItem("companyId");
    setCompanyId(raw ? Number(raw) : NaN);
  };

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
                {tests.filter(t=>t.isActive).length} of {tests.length} jobs have active tests
              </p>
            )}
          </div>
          <TestsList tests={tests} loading={loading} />
        </div>
      </div>
    </div>
  );
}

