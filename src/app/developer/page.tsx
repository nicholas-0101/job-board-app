"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "./components/DeveloperLayout";
import { 
  Code, 
  Database, 
  Settings, 
  Users, 
  BarChart3, 
  FileText, 
  Plus, 
  Award, 
  Shield,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeveloperPage() {
  const router = useRouter();
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderColor: '#E1F1F3' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Assessments
                    </CardTitle>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#24CFA7' }}>
                      <FileText className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-1 px-2 py-3">
                    <div className="text-2xl font-bold text-center">
                      {statsLoading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                      ) : (
                        stats.totalAssessments
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Total skill tests
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderColor: '#E1F1F3' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pending Approvals
                    </CardTitle>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#A3B6CE' }}>
                      <AlertCircle className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-1 px-2 py-3">
                    <div className="text-2xl font-bold text-center">
                      {statsLoading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                      ) : (
                        stats.pendingApprovals
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Subscription requests
                    </p>
                  </CardContent>
                </Card>

                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300" style={{ borderColor: '#E1F1F3' }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Certificates Issued
                    </CardTitle>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: '#24CFA7' }}>
                      <Award className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center gap-1 px-2 py-3">
                    <div className="text-2xl font-bold text-center">
                      {statsLoading ? (
                        <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                      ) : (
                        stats.certificatesIssued.toLocaleString()
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Total certificates
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Developer Tools */}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Developer Tools
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Skill Assessment Management */}
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group" style={{ borderColor: '#E1F1F3' }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#24CFA7' }}>
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                              Skill Assessment
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Manage skill tests, pass rate, badges, certificates
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: '#467EC7' }}
                        >
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Subscription Approval */}
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group" style={{ borderColor: '#E1F1F3' }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#A3B6CE' }}>
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                              Subscription Approval
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Approve subscription payments & manage access
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: '#467EC7' }}
                          onClick={() => router.push('/developer/subscription-approval/history')}
                        >
                          Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Badge & Certificate */}
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 group" style={{ borderColor: '#E1F1F3' }}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-lg" style={{ backgroundColor: '#24CFA7' }}>
                            <Award className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#467EC7] transition-colors duration-300">
                              Badge & Certificate
                            </h3>
                            <p className="text-gray-600 text-sm">
                              Issued certificates, badge templates, verification system
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="text-white"
                          style={{ backgroundColor: '#467EC7' }}
                        >
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

              </div>
            </section>
          </div>
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
