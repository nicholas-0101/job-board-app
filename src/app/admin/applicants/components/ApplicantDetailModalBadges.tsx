"use client";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ApplicantDetailModalBadgesProps {
  status: string;
  isPriority?: boolean;
  score: number | null;
  preselectionPassed?: boolean;
}

export function ApplicantDetailModalBadges({
  status,
  isPriority,
  score,
  preselectionPassed,
}: ApplicantDetailModalBadgesProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-700";
      case "INTERVIEW":
        return "bg-purple-100 text-purple-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge className={getStatusColor(status)}>
        {status}
      </Badge>
      {isPriority && (
        <Badge className="bg-amber-100 text-amber-700">
          <Star className="w-3 h-3 mr-1" />
          Priority
        </Badge>
      )}
      {score !== null && (
        <Badge className={preselectionPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
          Test: {score}/25 {preselectionPassed ? "✓" : "✗"}
        </Badge>
      )}
    </div>
  );
}
