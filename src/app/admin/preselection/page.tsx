"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TestTube, Users, Target, BarChart3, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listCompanyJobs } from "@/lib/jobs";
import { fetchPreselectionTest } from "@/lib/preselection";

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
          const token = localStorage.getItem("token");
          const resp = await fetch("http://localhost:4400/company/admin", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resp.ok) {
            const data = await resp.json();
            const resolved = Number(data?.id ?? data?.data?.id);
            if (resolved) {
              cid = resolved;
              localStorage.setItem("companyId", cid.toString());
              setCompanyId(cid);
            }
          }
        }
        if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

        // Fetch all jobs then load tests for each
        const jobs = await listCompanyJobs({ companyId: cid, limit: 100, offset: 0 } as any);
        const summaries: TestSummary[] = [];
        for (const j of jobs.items) {
          try {
            const t = await fetchPreselectionTest(j.id);
            summaries.push({
              jobId: j.id,
              jobTitle: j.title,
              isActive: !!t?.isActive,
              totalQuestions: t?.questions?.length ?? 0,
              passingScore: t?.passingScore ?? null,
            });
          } catch {
            summaries.push({ jobId: j.id, jobTitle: j.title, isActive: false, totalQuestions: 0, passingScore: null });
          }
        }
        setTests(summaries);
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const activeCount = useMemo(() => tests.filter((t) => t.isActive).length, [tests]);

  return (
    <div className="min-h-screen">
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">Pre-Selection Tests</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage pre-selection tests per job</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <Link href="/admin/jobs">
                <Button variant="outline" className="gap-2">
                  <Settings className="w-5 h-5" />
                  Manage Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[
            { label: "Jobs with Tests", value: tests.filter(t=>t.totalQuestions>0).length, icon: TestTube, color: "from-blue-500 to-blue-600" },
            { label: "Active Tests", value: activeCount, icon: Users, color: "from-green-500 to-green-600" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card>
                  <CardContent className="pt-6">
                    <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-1">{stat.value}</h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-8">
          <h3 className="text-base font-semibold mb-4">Per Job</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : (
            <div className="grid gap-4">
              {tests.map((t, index) => (
                <motion.div key={t.jobId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-base font-semibold">{t.jobTitle}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                              {t.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><TestTube className="w-4 h-4" /><span>{t.totalQuestions} Questions</span></div>
                            <div className="flex items-center gap-2"><Target className="w-4 h-4" /><span>Passing: {t.passingScore ?? '-'} / 25</span></div>
                            <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /><span>{t.isActive && t.totalQuestions ? 'Configured' : 'Not configured'}</span></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/jobs/${t.jobId}/edit?tab=test`}>
                            <Button size="sm" className="bg-[#24CFA7] hover:bg-[#1fc39c]">Edit Test</Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

