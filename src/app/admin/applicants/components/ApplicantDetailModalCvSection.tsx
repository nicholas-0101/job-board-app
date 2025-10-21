"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";

interface ApplicantDetailModalCvSectionProps {
  cvFile: string;
  userName: string;
}

export function ApplicantDetailModalCvSection({ cvFile, userName }: ApplicantDetailModalCvSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" />
          CV Document
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open(cvFile, '_blank')}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview CV
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              const link = document.createElement('a');
              link.href = cvFile;
              link.download = `${userName}_CV.pdf`;
              link.click();
            }}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download CV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
