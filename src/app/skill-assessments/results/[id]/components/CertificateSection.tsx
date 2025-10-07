"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trophy, Award } from "lucide-react";

interface AssessmentResult {
  isPassed: boolean;
  certificateUrl?: string;
  certificateCode?: string;
  assessment: {
    title: string;
    badgeTemplate?: {
      id: number;
      name: string;
      icon?: string;
      category?: string;
    };
  };
}

interface CertificateSectionProps {
  result: AssessmentResult;
  onDownloadCertificate: (certificateUrl: string) => void;
}

export default function CertificateSection({
  result,
  onDownloadCertificate,
}: CertificateSectionProps) {
  if (!result.isPassed) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#467EC7]" />
          Certificate & Badge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-[#E1F1F3]/50 border border-[#A3B6CE]/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#467EC7]/10 rounded-full">
              <Award className="w-8 h-8 text-[#467EC7]" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-gray-700 mb-4">
                You have successfully earned the <strong>{result.assessment.badgeTemplate?.name || 'Completion'}</strong> certificate 
                for completing the <strong>{result.assessment.title}</strong> assessment.
              </p>
              
              {result.assessment.badgeTemplate?.category && (
                <Badge variant="outline" className="mb-4 border-[#467EC7] text-[#467EC7] bg-[#467EC7]/5">
                  {result.assessment.badgeTemplate.category}
                </Badge>
              )}
              
              {result.certificateCode && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Certificate Code:</p>
                  <p className="font-mono text-sm bg-white px-3 py-2 rounded border inline-block">
                    {result.certificateCode}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3">
                {result.certificateUrl ? (
                  <Button
                    onClick={() => onDownloadCertificate(result.certificateUrl!)}
                    className="flex items-center gap-2 bg-[#467EC7] hover:bg-[#467EC7]/90 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Download className="w-5 h-5" />
                    Download Certificate
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="flex items-center gap-2 bg-gray-300 text-gray-500 cursor-not-allowed px-6 py-3 rounded-lg"
                  >
                    <Download className="w-5 h-5" />
                    Certificate Processing...
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
