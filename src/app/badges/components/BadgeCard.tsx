import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../types";
import { Calendar, Award, ExternalLink, Download } from "lucide-react";
import BadgeIcon from "./BadgeIcon";

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  const formatEarnedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 75) return "text-blue-600 bg-blue-100";
    return "text-yellow-600 bg-yellow-100";
  };

  const handleCertificateDownload = async (url: string, badgeName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${badgeName.replace(/[^a-z0-9]/gi, '_')}_Certificate.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download certificate:', error);
      // Fallback to opening in new tab
      window.open(url, '_blank');
    }
  };

  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
      badge.earned 
        ? "border-[#24CFA7]/30 bg-gradient-to-br from-[#24CFA7]/5 to-white" 
        : "border-gray-200 bg-gray-50/50 opacity-75"
    }`}>
      <CardContent className="p-6">
        {/* Badge Icon */}
        <BadgeIcon 
          icon={badge.icon} 
          name={badge.name} 
          earned={badge.earned} 
        />

        {/* Badge Name */}
        <h3 className={`text-lg font-semibold text-center mb-2 ${
          badge.earned ? "text-gray-900" : "text-gray-500"
        }`}>
          {badge.name}
        </h3>

        {/* Assessment Title */}
        <p className={`text-sm text-center mb-3 ${
          badge.earned ? "text-gray-600" : "text-gray-400"
        }`}>
          {badge.assessmentTitle}
        </p>

        {/* Category */}
        {badge.category && (
          <div className="flex justify-center mb-3">
            <span className={`px-2 py-1 text-xs rounded-full ${
              badge.earned 
                ? "bg-[#467EC7]/10 text-[#467EC7]" 
                : "bg-gray-200 text-gray-500"
            }`}>
              {badge.category}
            </span>
          </div>
        )}

        {/* Earned Badge Details */}
        {badge.earned && (
          <div className="space-y-3 mt-4">
            {/* Score */}
            {badge.score && (
              <div className="flex items-center justify-center gap-2">
                <Award className="w-4 h-4 text-[#24CFA7]" />
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${getScoreColor(badge.score)}`}>
                  {badge.score}%
                </span>
              </div>
            )}

            {/* Earned Date */}
            {badge.earnedAt && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Earned on {formatEarnedDate(badge.earnedAt)}</span>
              </div>
            )}

            {/* Certificate Link */}
            {badge.certificateUrl && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleCertificateDownload(badge.certificateUrl!, badge.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#467EC7] text-white text-sm rounded-lg hover:bg-[#467EC7]/90 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        )}

        {/* Unearned Badge Action */}
        {!badge.earned && (
          <div className="mt-4">
            <a
              href={`/skill-assessments/${badge.assessmentId}`}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Take Assessment
            </a>
          </div>
        )}

        {/* Earned Badge Indicator */}
        {badge.earned && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-[#24CFA7] rounded-full flex items-center justify-center">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
