import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Award, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubscriptionGuardProps {
  onCheckAgain: () => void;
  isAuthenticated: boolean | null;
}

export default function SubscriptionGuard({ 
  onCheckAgain, 
  isAuthenticated 
}: SubscriptionGuardProps) {
  const router = useRouter();

  // Show authentication required if not authenticated
  if (isAuthenticated === false) {
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

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-red-900 mb-4">
                  Authentication Required
                </h2>
                <p className="text-red-800 mb-6 text-lg">
                  You need to sign in to access Skill Assessments. 
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

  // Show subscription required if authenticated but no subscription
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
                  onClick={() => router.push("/subscription")}
                  className="bg-[#467EC7] hover:bg-[#467EC7]/90 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  View Subscription Plans
                </Button>
                <Button
                  variant="outline"
                  onClick={onCheckAgain}
                  className="border-[#467EC7]/30 text-[#467EC7] hover:bg-[#467EC7]/5 px-8 py-3"
                  size="lg"
                >
                  Check Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
