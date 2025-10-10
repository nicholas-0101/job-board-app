"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TestTube, Users, Target, BarChart3, Settings, CheckCircle, XCircle, Briefcase, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listCompanyJobs } from "@/lib/jobs";
import { apiCall } from "@/helper/axios";
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

  const activeCount = useMemo(() => tests.filter((t) => t.isActive).length, [tests]);

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
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Jobs", value: tests.length, icon: Briefcase, color: "from-blue-500 to-blue-600" },
            { label: "Jobs with Tests", value: tests.filter(t=>t.totalQuestions>0).length, icon: TestTube, color: "from-purple-500 to-purple-600" },
            { label: "Active Tests", value: activeCount, icon: CheckCircle, color: "from-green-500 to-green-600" },
            { label: "Inactive Tests", value: tests.filter(t=>!t.isActive).length, icon: XCircle, color: "from-gray-500 to-gray-600" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-semibold">{stat.value}</p>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                      </div>
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading tests...</p>
              </div>
            </div>
          ) : tests.length === 0 ? (
            <Card className="border-dashed shadow-md">
              <CardContent className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-primary-100 rounded-full">
                    <TestTube className="w-10 h-10 text-[#467EC7]" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">No jobs available</p>
                    <p className="text-muted-foreground">Create jobs first to add pre-selection tests</p>
                  </div>
                  <Link href="/admin/jobs/new">
                    <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] mt-2">Create First Job</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tests.map((t, index) => (
                <motion.div key={t.jobId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className="hover:shadow-lg transition-all duration-300 shadow-md border-l-4" style={{ borderLeftColor: t.isActive ? '#24CFA7' : '#94a3b8' }}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-lg font-semibold">{t.jobTitle}</h4>
                            {t.isActive ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                                ✓ Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <TestTube className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Questions</p>
                                <p className="font-semibold">{t.totalQuestions} / 25</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <Target className="w-4 h-4 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Passing Score</p>
                                <p className="font-semibold">{t.passingScore ?? '-'} / 25</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <BarChart3 className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-muted-foreground text-xs">Status</p>
                                <p className="font-semibold">{t.isActive && t.totalQuestions >= 25 ? 'Ready' : 'Setup Required'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/admin/jobs/${t.jobId}/edit?tab=test`}>
                            <Button className="bg-[#24CFA7] hover:bg-[#1fc39c] shadow-md">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Test
                            </Button>
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

