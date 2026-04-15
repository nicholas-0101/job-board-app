"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Code } from "lucide-react";

interface DeveloperBlockGuardProps {
  children: React.ReactNode;
}

export default function DeveloperBlockGuard({
  children,
}: DeveloperBlockGuardProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = () => {
      const userStr = localStorage.getItem("user");

      if (!userStr) {
        setIsLoading(false);
        return;
      }

      try {
        const user = JSON.parse(userStr);

        if (user.role === "DEVELOPER") {
          setIsBlocked(true);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserRole();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#467EC7]/20 bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-[#467EC7] mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-[#467EC7] mb-4">
                Access Restricted
              </h2>
              <p className="text-gray-600 mb-6">
                Developers cannot access user-specific features. Please use the
                developer dashboard.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/developer")}
                  className="w-full bg-[#467EC7] hover:bg-[#467EC7]/90 text-white"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Go to Developer Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="w-full border-[#467EC7] text-[#467EC7] hover:bg-[#467EC7] hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
