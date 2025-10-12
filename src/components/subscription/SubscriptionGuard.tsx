import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Crown, LogIn } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface SubscriptionGuardProps {
  children: ReactNode;
  feature: string;
  redirectTo?: string;
}

// Helper components (max 15 lines each)
const LoadingState = () => (
  <div className="min-h-screen bg-[#F0F5F9] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467EC7] mx-auto mb-4"></div>
      <p className="text-gray-600">Checking subscription status...</p>
    </div>
  </div>
);

const SubscriptionRequiredPage = ({
  feature,
  onUpgrade,
}: {
  feature: string;
  onUpgrade: () => void;
}) => (
  <div className="min-h-screen bg-[#F0F5F9] py-8">
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <div className="flex items-center gap-3 justify-center mb-4">
          <div className="p-2 bg-[#467EC7]/10 rounded-lg">
            <Crown className="w-6 h-6 text-[#467EC7]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{feature}</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {feature === "CV Generator" 
            ? "Create professional, ATS-friendly CVs with our easy-to-use generator"
            : `Access ${feature} to enhance your professional profile`
          }
        </p>
      </div>

      <Card className="border-[#467EC7]/20 bg-gradient-to-br from-[#467EC7]/5 to-[#24CFA7]/5">
        <CardContent className="p-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#467EC7]/10 rounded-full mb-6">
              <Crown className="w-10 h-10 text-[#467EC7]" />
            </div>
            <h2 className="text-3xl font-bold text-[#467EC7] mb-4">
              Subscription Required
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              {feature} is a premium feature that requires an active
              subscription. Upgrade your account to access professional tools
              and enhance your career opportunities.
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

export default function SubscriptionGuard({
  children,
  feature,
  redirectTo = "/subscription",
}: SubscriptionGuardProps) {
  const router = useRouter();
  const { hasSubscription, isLoading, isAuthenticated } = useSubscription();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/go-to-signin");
    }
  }, [isAuthenticated, router]);

  const handleUpgrade = () => router.push(redirectTo);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated === false) {
    return null;
  }
  
  if (!hasSubscription) {
    return (
      <SubscriptionRequiredPage
        feature={feature}
        onUpgrade={handleUpgrade}
      />
    );
  }

  return <>{children}</>;
}
