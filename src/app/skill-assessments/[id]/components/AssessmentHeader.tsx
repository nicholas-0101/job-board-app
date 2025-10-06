"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Trophy, User, AlertCircle } from "lucide-react";

interface AssessmentHeaderProps {
  title: string;
  description?: string;
  creatorName: string;
  badgeTemplate?: {
    name: string;
    icon?: string;
    category?: string;
  };
  timeLeft: number;
  formatTime: (seconds: number) => string;
  getTimeWarning: () => string;
  started: boolean;
  onBack: () => void;
}

export default function AssessmentHeader({
  title,
  description,
  creatorName,
  badgeTemplate,
  timeLeft,
  formatTime,
  getTimeWarning,
  started,
  onBack,
}: AssessmentHeaderProps) {
  const timeWarning = getTimeWarning();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Assessments
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            {description && (
              <p className="text-gray-600 mb-4">{description}</p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>Created by {creatorName}</span>
            </div>
          </div>

          {badgeTemplate && (
            <div className="ml-4">
              <Badge variant="secondary" className="bg-[#24CFA7]/10 text-[#24CFA7] border-[#24CFA7]/20">
                <Trophy className="w-3 h-3 mr-1" />
                Certificate Available
              </Badge>
            </div>
          )}
        </div>

        {started && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-600">Time Remaining:</span>
            </div>
            <div className={`flex items-center gap-2 font-mono text-lg font-bold ${
              timeWarning === "danger" ? "text-red-600" : 
              timeWarning === "warning" ? "text-orange-600" : "text-gray-900"
            }`}>
              {timeWarning !== "normal" && <AlertCircle className="w-5 h-5" />}
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
