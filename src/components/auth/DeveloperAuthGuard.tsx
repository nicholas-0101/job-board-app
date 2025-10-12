"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn, Code, Shield } from "lucide-react";

interface DeveloperAuthGuardProps {
  children: React.ReactNode;
}

export default function DeveloperAuthGuard({
  children,
}: DeveloperAuthGuardProps) {
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated" | "unauthorized"
  >("loading");
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        setAuthState("unauthenticated");
        return;
      }

      try {
        const user = JSON.parse(userStr);

        if (user.role !== "DEVELOPER") {
          setAuthState("unauthorized");
          return;
        }

        setAuthState("authenticated");
      } catch (error) {
        console.error("Error parsing user data:", error);
        setAuthState("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (authState === "loading") {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[#467EC7] rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Code className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467EC7] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying developer access...</p>
        </div>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#467EC7]/20 bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#467EC7] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-[#467EC7] mb-4">
                Developer Authentication Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need to sign in with a developer account to access this
                area.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => router.push("/developer/signin")}
                  className="w-full bg-[#467EC7] hover:bg-[#467EC7]/90 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Developer Sign In
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full border-[#467EC7] text-[#467EC7] hover:bg-[#467EC7] hover:text-white"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (authState === "unauthorized") {
    return (
      <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#467EC7]/20 bg-white shadow-lg">
          <CardContent className="p-8">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-[#467EC7] mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-[#467EC7] mb-4">
                Access Denied
              </h2>
              <p className="text-gray-600 mb-6">
                This area is restricted to developer accounts only. Your current
                account does not have the required permissions.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    router.push("/developer/signin");
                  }}
                  className="w-full bg-[#467EC7] hover:bg-[#467EC7]/90 text-white"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In as Developer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full border-[#467EC7] text-[#467EC7] hover:bg-[#467EC7] hover:text-white"
                >
                  Back to Home
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
