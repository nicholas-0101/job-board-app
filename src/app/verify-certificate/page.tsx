"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Shield, Award, CheckCircle } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import SubscriptionGuard from "@/components/verify-certificate/SubscriptionGuard";

export default function VerifyCertificatePage() {
  const router = useRouter();
  const [certificateCode, setCertificateCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { hasSubscription, isAuthenticated, isLoading: authLoading } = useSubscription();

  useEffect(() => {
    if (!authLoading && isAuthenticated === false) {
      router.push("/go-to-signin");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleVerify = async () => {
    if (!certificateCode.trim()) {
      alert("Please enter a certificate code");
      return;
    }

    setIsLoading(true);
    // Navigate to the verification page with the code
    router.push(`/verify-certificate/${certificateCode.trim()}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
              <p className="text-[#A3B6CE]">Loading certificate verification...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription guard if needed
  if (isAuthenticated === false || hasSubscription === false) {
    return (
      <SubscriptionGuard 
        hasSubscription={hasSubscription}
        isAuthenticated={isAuthenticated}
        onUpgrade={() => router.push("/subscription")}
        onSignIn={() => router.push("/auth/signin")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#467EC7]/10 rounded-lg">
              <Shield className="w-8 h-8 text-[#467EC7]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Certificate Verification
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Verify the authenticity of skill assessment certificates issued by
            Workoo Job Board. Enter the certificate code to check if a
            certificate is valid and view its details.
          </p>
        </div>

        {/* Verification Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-[#467EC7]" />
              Enter Certificate Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label
                htmlFor="certificateCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Certificate Code
              </label>
              <Input
                id="certificateCode"
                type="text"
                placeholder="Enter certificate code (e.g., CERT-ABC123-XYZ789)"
                value={certificateCode}
                onChange={(e) => setCertificateCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="font-mono"
              />
              <p className="text-xs text-gray-500 mt-1">
                Certificate codes are typically found on the certificate PDF or
                in verification emails
              </p>
            </div>

            <Button
              onClick={handleVerify}
              disabled={isLoading || !certificateCode.trim()}
              className="w-full bg-[#24CFA7] hover:bg-[#24CFA7]/90 text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Verify Certificate
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#467EC7]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-[#467EC7]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                1. Enter Code
              </h3>
              <p className="text-sm text-gray-600">
                Enter the certificate code found on your certificate PDF
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-[#24CFA7]/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-[#24CFA7]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Verify</h3>
              <p className="text-sm text-gray-600">
                Our system checks the certificate against our secure database
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                3. View Details
              </h3>
              <p className="text-sm text-gray-600">
                See certificate details, recipient info, and assessment results
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#467EC7]" />
              Certificate Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Secure Verification
                  </h4>
                  <p className="text-sm text-gray-600">
                    Each certificate has a unique code for verification
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Detailed Information
                  </h4>
                  <p className="text-sm text-gray-600">
                    View assessment details, scores, and recipient info
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">PDF Download</h4>
                  <p className="text-sm text-gray-600">
                    Access the original certificate PDF document
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Instant Results</h4>
                  <p className="text-sm text-gray-600">
                    Get verification results immediately
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white rounded-lg shadow-sm">
          <p className="text-sm text-gray-600">
            Certificate verification is provided by{" "}
            <strong>Workoo Job Board</strong> - Professional Skill Assessment
            Platform
          </p>
          <p className="text-xs text-gray-500 mt-2">
            For questions about certificate verification, please contact our
            support team.
          </p>
        </div>
      </div>
    </div>
  );
}
