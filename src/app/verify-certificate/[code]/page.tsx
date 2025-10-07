'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, Award, Calendar, User, FileText } from 'lucide-react';

interface CertificateData {
  id: number;
  certificateCode: string;
  score: number;
  isPassed: boolean;
  certificateUrl: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  assessment: {
    id: number;
    title: string;
    description: string;
    category: string;
  };
}

export default function VerifyCertificatePage() {
  const params = useParams();
  const certificateCode = params.code as string;
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:4400'}/skill-assessment/verify/${certificateCode}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Certificate not found. Please check the certificate code.');
          } else {
            setError('Failed to verify certificate. Please try again later.');
          }
          return;
        }

        const data = await response.json();
        if (data.success && data.certificate) {
          setCertificate(data.certificate);
        } else {
          setError(data.message || 'Certificate verification failed');
        }
      } catch (err) {
        setError('Failed to verify certificate. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    if (certificateCode) {
      verifyCertificate();
    }
  }, [certificateCode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#467EC7] mb-4" />
            <p className="text-gray-600">Verifying certificate...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-600 text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <XCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Certificate Not Found</h2>
            <p className="text-gray-600 text-center">The certificate code you provided is invalid or does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate Verification</h1>
          <p className="text-gray-600">Verify the authenticity of skill assessment certificates</p>
        </div>

        {/* Verification Status */}
        <Card className="mb-8">
          <CardContent className="flex items-center justify-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mr-4" />
            <div>
              <h2 className="text-2xl font-semibold text-green-700 mb-1">Certificate Verified</h2>
              <p className="text-gray-600">This certificate is authentic and valid</p>
            </div>
          </CardContent>
        </Card>

        {/* Certificate Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Certificate Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#467EC7]" />
                Certificate Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Certificate Code</label>
                <p className="font-mono text-sm bg-gray-100 px-3 py-2 rounded border">
                  {certificate.certificateCode}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Assessment</label>
                <p className="font-semibold text-gray-900">{certificate.assessment.title}</p>
                <p className="text-sm text-gray-600">{certificate.assessment.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Category</label>
                <Badge variant="outline" className="ml-2">
                  {certificate.assessment.category}
                </Badge>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Score</label>
                <p className="font-semibold text-[#467EC7]">{certificate.score}% - PASSED</p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Issued on {new Date(certificate.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#467EC7]" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="font-semibold text-gray-900">{certificate.user.name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-700">{certificate.user.email}</p>
              </div>

              <div className="pt-4">
                <a
                  href={`${process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:4400'}/skill-assessment/certificates/${certificate.certificateCode}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#467EC7] text-white px-4 py-2 rounded-lg hover:bg-[#3a6ba5] transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  View Certificate PDF
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            This certificate was issued by <strong>Workoo Job Board</strong> - Professional Skill Assessment Platform
          </p>
          <p className="text-xs text-gray-500 mt-2">
            For questions about this certificate, please contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}
