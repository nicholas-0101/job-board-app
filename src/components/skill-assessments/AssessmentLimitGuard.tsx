"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Award, Crown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";

interface AssessmentLimitGuardProps {
  assessmentId: number;
  children: React.ReactNode;
}

interface SubscriptionInfo {
  plan: "STANDARD" | "PREMIUM";
  isActive: boolean;
}

interface AssessmentAttempt {
  id: number;
  assessmentId: number;
  userId: number;
  createdAt: string;
}

export default function AssessmentLimitGuard({
  assessmentId,
  children,
}: AssessmentLimitGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null
  );
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    checkAccessPermission();
  }, [assessmentId]);

  const checkAccessPermission = async () => {
    try {
      setLoading(true);

      // Get subscription info
      const subscriptionResponse = await apiCall.get(
        "/subscription/my-active-subscription"
      );
      const subscriptionData = subscriptionResponse.data;

      // Get user's assessment attempts for this specific assessment
      const attemptsResponse = await apiCall.get(
        `/skill-assessment/assessments/${assessmentId}/my-attempts`
      );
      const attemptsData = attemptsResponse.data?.data || [];

      setSubscription({
        plan: subscriptionData?.plan?.code || "STANDARD",
        isActive: subscriptionData?.status === "ACTIVE",
      });
      setAttempts(attemptsData);

      // Debug logging
      console.log("🔍 Assessment Access Debug:", {
        assessmentId,
        planObject: subscriptionData?.plan,
        planCode: subscriptionData?.plan?.code || "STANDARD",
        attemptsCount: attemptsData.length,
        attempts: attemptsData,
        subscription: subscriptionData,
      });

      // Check access permission
      const planCode = subscriptionData?.plan?.code || "STANDARD";
      const hasAccess = checkCanAccess(planCode, attemptsData);
      console.log("✅ Access Decision:", {
        hasAccess,
        reason: hasAccess ? "Allowed" : "Blocked",
        planCode,
      });
      setCanAccess(hasAccess);
    } catch (error: any) {
      console.error("Error checking assessment access:", error);
      console.error(
        "API Error Details:",
        error.response?.data || error.message
      );

      // Fallback: Allow access if API fails (better UX)
      setCanAccess(true);
      setSubscription({ plan: "STANDARD", isActive: true });
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  };

  const checkCanAccess = (
    plan: string,
    userAttempts: AssessmentAttempt[]
  ): boolean => {
    // Premium users have unlimited access
    if (plan === "PREMIUM") {
      return true;
    }

    // Standard users are limited to 2 attempts per assessment
    if (plan === "STANDARD") {
      return userAttempts.length < 2;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user can access, render children
  if (canAccess) {
    return <>{children}</>;
  }

  // Show limit reached message for Standard users
  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="p-2 bg-[#467EC7]/10 rounded-lg">
              <Award className="w-6 h-6 text-[#467EC7]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Skill Assessment
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Assessment attempt limit reached
          </p>
        </div>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardContent className="p-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                <AlertCircle className="w-10 h-10 text-orange-600" />
              </div>

              <h2 className="text-3xl font-bold text-orange-800 mb-4">
                Assessment Limit Reached
              </h2>

              <div className="bg-white/70 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Standard Plan Limits
                  </span>
                </div>
                <p className="text-gray-700 mb-4">
                  You have used <strong>{attempts.length} out of 2</strong>{" "}
                  attempts for this assessment. Standard plan users are limited
                  to <strong>2 attempts per assessment</strong>.
                </p>
                <div className="text-sm text-gray-600">
                  Last attempt:{" "}
                  {attempts.length > 0
                    ? new Date(
                        attempts[attempts.length - 1].createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-purple-600" />
                  <span className="font-bold text-purple-800 text-lg">
                    Upgrade to Premium
                  </span>
                </div>
                <p className="text-purple-700 mb-4">
                  Get <strong>unlimited assessment attempts</strong> and access
                  to all premium features!
                </p>
                <ul className="text-sm text-purple-600 space-y-1 mb-4">
                  <li>✓ Unlimited assessment retakes</li>
                  <li>✓ Advanced skill analytics</li>
                  <li>✓ Priority certificate generation</li>
                  <li>✓ Premium CV templates</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/subscription")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/skill-assessments")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3"
                  size="lg"
                >
                  Browse Other Assessments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
