"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogIn } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  showWarning?: boolean;
}

export default function AuthGuard({ 
  children, 
  redirectTo = "/signin", 
  showWarning = false 
}: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        if (mounted) {
          setIsAuthenticated(false);
          if (!showWarning) {
            toast.error("Please sign in to access this page");
            router.push(redirectTo);
          }
        }
        return;
      }

      // You can add token validation here if needed
      if (mounted) {
        setIsAuthenticated(true);
      }
    };

    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, [router, redirectTo, showWarning]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && showWarning) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">CV Generator</h1>
            <p className="text-xl text-gray-600">
              Create professional, ATS-friendly CVs with our easy-to-use generator.
            </p>
          </div>
          
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-red-900 mb-4">
                  Authentication Required
                </h2>
                <p className="text-red-800 mb-6 text-lg">
                  You need to sign in to access the CV Generator feature. 
                  Please log in to your account to continue.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={() => router.push('/signin')}
                    className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/signup')}
                    className="px-8 py-3 text-lg"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect for non-warning mode
  }

  return <>{children}</>;
}
