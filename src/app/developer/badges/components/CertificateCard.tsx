import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, QrCode, Shield, ShieldCheck, Mail, Calendar } from "lucide-react";
import { Certificate } from "../types";

interface CertificateCardProps {
  certificate: Certificate;
  onDownload?: (certificate: Certificate) => void;
  onViewQR?: (certificate: Certificate) => void;
}

export default function CertificateCard({ certificate, onDownload, onViewQR }: CertificateCardProps) {
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
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center">
              {certificate.verified ? (
                <ShieldCheck className="h-6 w-6 text-white" />
              ) : (
                <Shield className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{certificate.recipientName}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={certificate.verified ? "default" : "secondary"}>
                  {certificate.verified ? "Verified" : "Pending"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {certificate.certificateId}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {onViewQR && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewQR(certificate)}
                className="h-8 w-8 p-0"
              >
                <QrCode className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(certificate)}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{certificate.recipientEmail}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Badge:</span>
              <p className="text-gray-600">{certificate.badgeName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Score:</span>
              <p className="text-gray-600 font-semibold">{certificate.assessmentScore}%</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Issued: {formatDate(certificate.issuedAt)}</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-500">
              <Download className="h-4 w-4" />
              <span>{certificate.downloadCount} downloads</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
