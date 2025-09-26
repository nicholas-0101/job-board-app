import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CheckCircle, Clock } from "lucide-react";
import { SkillAssessment } from "../types";

interface AssessmentStatsProps {
  assessments: SkillAssessment[];
}

export default function AssessmentStats({ assessments }: AssessmentStatsProps) {
  const stats = {
    totalAssessments: assessments.length,
    activeAssessments: assessments.filter(a => a.status === "active").length,
    totalParticipants: assessments.reduce((sum, a) => sum + a.participants, 0),
    totalPassed: assessments.reduce((sum, a) => sum + a.passedCount, 0)
  };

  const overallSuccessRate = stats.totalParticipants > 0 
    ? Math.round((stats.totalPassed / stats.totalParticipants) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
          <FileText className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAssessments}</div>
          <p className="text-xs text-muted-foreground">Assessment templates</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeAssessments}</div>
          <p className="text-xs text-muted-foreground">Currently available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants</CardTitle>
          <Users className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalParticipants}</div>
          <p className="text-xs text-muted-foreground">Total test takers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{overallSuccessRate}%</div>
          <p className="text-xs text-muted-foreground">Overall pass rate</p>
        </CardContent>
      </Card>
    </div>
  );
}
