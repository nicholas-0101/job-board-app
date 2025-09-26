import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layout, Users, Download } from "lucide-react";
import { CVTemplate, GeneratedCV } from "../types";

interface CVGeneratorStatsProps {
  templates: CVTemplate[];
  generatedCVs: GeneratedCV[];
}

export default function CVGeneratorStats({ templates, generatedCVs }: CVGeneratorStatsProps) {
  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.status === "active").length,
    totalGenerated: generatedCVs.length,
    totalDownloads: generatedCVs.reduce((sum, cv) => sum + cv.downloadCount, 0)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
          <Layout className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTemplates}</div>
          <p className="text-xs text-muted-foreground">CV templates available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
          <FileText className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeTemplates}</div>
          <p className="text-xs text-muted-foreground">Currently available</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Generated CVs</CardTitle>
          <Users className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{stats.totalGenerated}</div>
          <p className="text-xs text-muted-foreground">Total CVs created</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          <Download className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.totalDownloads}</div>
          <p className="text-xs text-muted-foreground">Total downloads</p>
        </CardContent>
      </Card>
    </div>
  );
}
