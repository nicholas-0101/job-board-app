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
  const [monthlyLimitReached, setMonthlyLimitReached] = useState(false);
  const [monthlyCount, setMonthlyCount] = useState(0);

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

      // Check monthly limit by counting unique assessments this month
      const monthlyResponse = await apiCall.get('/skill-assessment/user/results');
      const allResults = monthlyResponse.data?.data?.results || [];
      
      // Get current month start
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);
      
      // Count unique assessments this month
      const thisMonthResults = allResults.filter((result: any) => 
        new Date(result.createdAt) >= currentMonth
      );
      
      const uniqueAssessments = new Set(thisMonthResults.map((result: any) => result.assessmentId));
      const monthlyCount = uniqueAssessments.size;
      
      // Check if current assessment is already taken
      const hasCurrentAssessment = uniqueAssessments.has(assessmentId);

      setSubscription({
        plan: subscriptionData?.plan?.code || "STANDARD",
        isActive: subscriptionData?.status === "ACTIVE",
      });
      setAttempts(attemptsData);

      // Check access permission
      const planCode = subscriptionData?.plan?.code || "STANDARD";
      const perAssessmentAccess = checkCanAccess(planCode, attemptsData);
      
      // Check monthly limit for Standard plan
      const monthlyLimitExceeded = planCode === "STANDARD" && 
        monthlyCount >= 2 && 
        !hasCurrentAssessment;
      
      const hasAccess = perAssessmentAccess && !monthlyLimitExceeded;
      
      setCanAccess(hasAccess);
      setMonthlyLimitReached(monthlyLimitExceeded);
      setMonthlyCount(monthlyCount);
    } catch (error: any) {
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

  // Show limit reached message
  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#E1F1F3] rounded-full">
              <Award className="w-8 h-8 text-[#467EC7]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">
              Skill Assessment
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {monthlyLimitReached ? "Monthly assessment limit reached" : "Assessment attempt limit reached"}
          </p>
        </div>

        <Card className="max-w-2xl mx-auto bg-[#FFFFFF] shadow-sm border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[#24CFA7]/10 rounded-full mb-6">
                <AlertCircle className="w-10 h-10 text-[#24CFA7]" />
              </div>

              <h2 className="text-2xl font-bold text-[#467EC7] mb-4">
                {monthlyLimitReached ? "Monthly Limit Reached" : "Assessment Limit Reached"}
              </h2>

              <div className="bg-[#F0F5F9] rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-[#24CFA7]" />
                  <span className="font-semibold text-[#467EC7]">
                    Standard Plan Limits
                  </span>
                </div>
                
                {monthlyLimitReached ? (
                  <div>
                    <p className="text-gray-600 mb-4">
                      You have taken <strong className="text-gray-800">{monthlyCount} out of 2</strong>{" "}
                      assessments this month. Standard plan users are limited
                      to <strong className="text-gray-800">2 assessments per month</strong>.
                    </p>
                    <div className="text-sm text-gray-500">
                      Your monthly quota will reset on{" "}
                      <strong className="text-gray-700">{new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString()}</strong>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">
                      You have completed <strong className="text-gray-800">{attempts.length} out of 2</strong>{" "}
                      attempts for this assessment. Standard plan users are limited
                      to <strong className="text-gray-800">2 attempts per assessment</strong>.
                    </p>
                    <div className="text-sm text-gray-500">
                      Last attempt:{" "}
                      {attempts.length > 0
                        ? new Date(
                            attempts[attempts.length - 1].createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-[#A3B6CE]/20 to-[#E1F1F3]/30 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-[#467EC7]" />
                  <span className="font-bold text-[#467EC7] text-lg">
                    Upgrade to Premium
                  </span>
                </div>
                <p className="text-[#467EC7] mb-4">
                  Get <strong className="text-[#467EC7]">unlimited assessment attempts</strong> and access
                  to all premium features!
                </p>
                <ul className="text-sm text-[#467EC7] space-y-1 mb-4">
                  <li>✓ Unlimited assessment retakes</li>
                  <li>✓ Advanced skill analytics</li>
                  <li>✓ Priority certificate generation</li>
                  <li>✓ Premium CV templates</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push("/subscription")}
                  className="bg-[#467EC7] hover:bg-[#467EC7]/90 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-sm"
                  size="lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Premium
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/skill-assessments")}
                  className="border-[#467EC7]/30 text-[#467EC7] hover:bg-[#F0F5F9] hover:text-[#467EC7] px-8 py-3 rounded-lg"
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
