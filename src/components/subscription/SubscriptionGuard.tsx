import { ReactNode } from "react";
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

const AuthRequiredCard = ({ onSignIn }: { onSignIn: () => void }) => (
  <Card className="border-[#467EC7]/20 bg-[#467EC7]/5">
    <CardContent className="p-8">
      <div className="text-center">
        <AlertCircle className="w-16 h-16 text-[#467EC7] mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-[#467EC7] mb-4">
          Authentication Required
        </h2>
        <p className="text-gray-600 mb-6">
          Please sign in to access this feature
        </p>
        <Button onClick={onSignIn} className="bg-[#467EC7] hover:bg-[#467EC7]/90">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </div>
    </CardContent>
  </Card>
);

const SubscriptionRequiredCard = ({ feature, onUpgrade }: { feature: string; onUpgrade: () => void }) => (
  <Card className="border-[#24CFA7]/20 bg-[#24CFA7]/5">
    <CardContent className="p-8">
      <div className="text-center">
        <Crown className="w-16 h-16 text-[#24CFA7] mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-[#24CFA7] mb-4">
          Subscription Required
        </h2>
        <p className="text-gray-600 mb-6">
          Access to {feature} requires an active subscription
        </p>
        <Button onClick={onUpgrade} className="bg-[#24CFA7] hover:bg-[#24CFA7]/90">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade Now
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function SubscriptionGuard({ 
  children, 
  feature, 
  redirectTo = "/subscription" 
}: SubscriptionGuardProps) {
  const router = useRouter();
  const { hasSubscription, isLoading, isAuthenticated } = useSubscription();

  const handleSignIn = () => router.push("/signin");
  const handleUpgrade = () => router.push(redirectTo);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <AuthRequiredCard onSignIn={handleSignIn} />
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <SubscriptionRequiredCard feature={feature} onUpgrade={handleUpgrade} />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
