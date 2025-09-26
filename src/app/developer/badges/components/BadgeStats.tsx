import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Trophy, Medal, Shield } from "lucide-react";
import { Badge, Certificate } from "../types";

interface BadgeStatsProps {
  badges: Badge[];
  certificates: Certificate[];
}

export default function BadgeStats({ badges, certificates }: BadgeStatsProps) {
  const stats = {
    totalBadges: badges.length,
    activeBadges: badges.filter(b => b.status === "active").length,
    totalCertificates: certificates.length,
    verifiedCertificates: certificates.filter(c => c.verified).length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Badges</CardTitle>
          <Award className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBadges}</div>
          <p className="text-xs text-muted-foreground">Badge templates created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Badges</CardTitle>
          <Trophy className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeBadges}</div>
          <p className="text-xs text-muted-foreground">Currently available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Certificates</CardTitle>
          <Medal className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalCertificates}</div>
          <p className="text-xs text-muted-foreground">Total issued</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verified</CardTitle>
          <Shield className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.verifiedCertificates}</div>
          <p className="text-xs text-muted-foreground">Verified certificates</p>
        </CardContent>
      </Card>
    </div>
  );
}
