"use client";
import { useEffect } from "react";
import { useBadgeState } from "./hooks/useBadgeState";
import { useSubscription } from "@/hooks/useSubscription";
import { useRouter } from "next/navigation";
import SubscriptionGuard from "@/components/skill-assessments/SubscriptionGuard";
import BadgeHeader from "./components/BadgeHeader";
import BadgeGrid from "./components/BadgeGrid";
import BadgeStats from "./components/BadgeStats";
import LoadingSpinner from "./components/LoadingSpinner";

export default function BadgesPage() {
  const router = useRouter();
  const { hasSubscription, isLoading: subscriptionLoading, isAuthenticated } = useSubscription();
  
  const {
    badges,
    loading,
    fetchBadges,
    getTotalBadges,
    getPassedBadges,
    getBadgesByCategory
  } = useBadgeState();

  useEffect(() => {
    if (isAuthenticated && hasSubscription) {
      fetchBadges();
    }
  }, [isAuthenticated, hasSubscription, fetchBadges]);

  // Show loading while checking subscription
  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="max-w-6xl mx-auto px-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show subscription guard if not authenticated or no subscription
  if (isAuthenticated === false || hasSubscription === false) {
    return (
      <SubscriptionGuard 
        hasSubscription={hasSubscription}
        isAuthenticated={isAuthenticated}
        onUpgrade={() => router.push('/subscription')}
        onSignIn={() => router.push('/go-to-signin')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <BadgeHeader />
        
        <BadgeStats 
          totalBadges={getTotalBadges()}
          passedBadges={getPassedBadges()}
          categories={getBadgesByCategory()}
        />
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <BadgeGrid badges={badges} />
        )}
      </div>
    </div>
  );
}
