"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";
import { Certificate } from "../types";
import CertificateCard from "./CertificateCard";

interface CertificatesContentProps {
  certificates: Certificate[];
  onDownload: (certificate: Certificate) => void;
  onViewQR: (certificate: Certificate) => void;
}

export function CertificatesContent({ certificates, onDownload, onViewQR }: CertificatesContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5" />
          <span>Issued Certificates</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Certificates Yet
            </h3>
            <p className="text-gray-500">
              Certificates will appear here when users complete
              assessments.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onDownload={onDownload}
                onViewQR={onViewQR}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
