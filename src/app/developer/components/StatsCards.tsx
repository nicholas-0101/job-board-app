"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle, Award } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalAssessments: number;
    pendingApprovals: number;
    certificatesIssued: number;
  };
  statsLoading: boolean;
}

export function StatsCards({ stats, statsLoading }: StatsCardsProps) {
  return (
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
  );
}
