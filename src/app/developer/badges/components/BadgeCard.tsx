import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Users } from "lucide-react";
import { Badge as BadgeType } from "../types";

interface BadgeCardProps {
  badge: BadgeType;
  onEdit?: (badge: BadgeType) => void;
  onDelete?: (badgeId: number) => void;
  onView?: (badge: BadgeType) => void;
}

export default function BadgeCard({ badge, onEdit, onDelete, onView }: BadgeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4" 
          style={{ borderLeftColor: badge.color }}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${badge.color}20` }}
            >
              {badge.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{badge.name}</CardTitle>
              <Badge className={getStatusColor(badge.status)}>
                {badge.status}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {onView && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(badge)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(badge)}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(badge.id)}
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
          <p className="text-sm text-gray-600">{badge.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="font-medium text-gray-700">Category:</span>
              <span className="ml-1 text-gray-600">{badge.category}</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-600">
              <Users className="h-4 w-4" />
              <span className="font-medium">{badge.issuedCount}</span>
              <span className="text-gray-500">issued</span>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Requirements:</span> {badge.requirements}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Created: {formatDate(badge.createdAt)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
