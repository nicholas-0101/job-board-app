import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Trash2, User, Mail, Calendar, FileText } from "lucide-react";
import { GeneratedCV } from "../types";

interface GeneratedCVCardProps {
  cv: GeneratedCV;
  onDownload?: (cv: GeneratedCV) => void;
  onView?: (cv: GeneratedCV) => void;
  onDelete?: (cvId: number) => void;
}

export default function GeneratedCVCard({ cv, onDownload, onView, onDelete }: GeneratedCVCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return "✓";
      case "processing": return "⏳";
      case "failed": return "✗";
      default: return "?";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{cv.userName}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(cv.status)}>
                  <span className="mr-1">{getStatusIcon(cv.status)}</span>
                  {cv.status}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {cv.status === "completed" && onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(cv)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {cv.status === "completed" && onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(cv)}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(cv.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{cv.userEmail}</span>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">Template:</span>
              <span className="ml-2 text-gray-600">{cv.templateName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">File:</span>
              <span className="ml-2 text-gray-600">{cv.fileName}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Generated: {formatDate(cv.createdAt)}</span>
            </div>
            {cv.status === "completed" && (
              <div className="flex items-center space-x-1 text-gray-500">
                <Download className="h-4 w-4" />
                <span>{cv.downloadCount} downloads</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
