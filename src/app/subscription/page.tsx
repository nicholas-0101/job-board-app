"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { subscriptionPlans } from "@/components/subscription/subscriptionPlans";
import SignInModal from "@/components/subscription/SignInModal";
import PlanCard from "@/components/subscription/PlanCard";

export default function SubscriptionPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handlePlanSelection = (planId: string) => {
    if (!isAuthenticated) {
      // Show sign in modal instead of redirecting
      setShowSignInModal(true);
    } else {
      // User is authenticated, proceed to transaction
      router.push(`/transaction?plan=${planId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F5F9]">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#467EC7] to-[#24CFA7] text-white py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6">
              Choose Your <span className="text-white">Perfect Plan</span>
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Unlock premium features and accelerate your career journey with
              our subscription plans
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {subscriptionPlans.map((plan, index) => (
            <PlanCard 
              key={plan.id}
              plan={plan}
              onSelectPlan={handlePlanSelection}
            />
          ))}
        </div>
      </div>

      {/* Sign In Required Modal */}
      <SignInModal 
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
}
