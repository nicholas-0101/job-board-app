import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Award, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface SubscriptionGuardProps {
  hasSubscription: boolean | null;
  isAuthenticated: boolean | null;
  onUpgrade: () => void;
  onSignIn: () => void;
}

export default function SubscriptionGuard({ 
  hasSubscription,
  isAuthenticated,
  onUpgrade,
  onSignIn
}: SubscriptionGuardProps) {
  const router = useRouter();

  // Show authentication required if not authenticated
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/go-to-signin");
    }
  }, [isAuthenticated, router]);

  // if still checking or about to redirect, show nothing
  if (isAuthenticated === false) {
    return null;
  }

  // Show subscription required if authenticated but no subscription
  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="p-2 bg-[#467EC7]/10 rounded-lg">
                <Award className="w-6 h-6 text-[#467EC7]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Skill Assessments</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Test your skills and earn certificates to showcase your expertise
            </p>
          </div>

          <Card className="border-[#467EC7]/20 bg-gradient-to-br from-[#467EC7]/5 to-[#24CFA7]/5">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#467EC7]/10 rounded-full mb-6">
                  <Award className="w-10 h-10 text-[#467EC7]" />
                </div>
                <h2 className="text-3xl font-bold text-[#467EC7] mb-4">
                  Subscription Required
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                  Skill Assessments are a premium feature that requires an active
                  subscription. Upgrade your account to access professional skill tests,
                  earn certificates, and showcase your expertise to employers.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={onUpgrade}
                    className="bg-[#467EC7] hover:bg-[#467EC7]/90 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    View Subscription Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Otherwise render nothing (or children, if you plan to use this as a wrapper)
  return null;
}