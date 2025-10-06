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
  if (!result.isPassed || !result.assessment.badgeTemplate) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-600" />
          Certificate & Badge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-gray-700 mb-4">
                You have successfully earned the <strong>{result.assessment.badgeTemplate.name}</strong> certificate 
                for completing the <strong>{result.assessment.title}</strong> assessment.
              </p>
              
              {result.assessment.badgeTemplate.category && (
                <Badge variant="outline" className="mb-4">
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
                    className="flex items-center gap-2 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] hover:from-[#467EC7]/90 hover:to-[#24CFA7]/90 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
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
