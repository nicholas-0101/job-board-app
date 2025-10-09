"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { subscriptionPlans } from "@/components/subscription/subscriptionPlans";
import PlanCard from "@/components/subscription/PlanCard";
import SubscriptionFeatures from "@/components/subscription/SubscriptionFeatures";
import { Button } from "@/components/ui/button";

export default function SubscriptionPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handlePlanSelection = (planId: string) => {
    if (!isAuthenticated) {
      // Show sign in modal instead of redirecting
      router.push("/go-to-signin");
    } else {
      // User is authenticated, proceed to transaction
      router.push(`/transaction?plan=${planId}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20" style={{ backgroundColor: '#F0F5F9' }}>
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 text-[#467EC7]">
              Choose Your <span className="text-[#24CFA7]">Perfect Plan</span>
            </h1>
            <p className="text-xl mb-8 text-gray-600">
              Unlock premium features and accelerate your career journey with
              our subscription plans. 30-day duration with H-1 email reminders.
            </p>
            
            {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <Button
                  onClick={() => router.push("/subscription/renew")}
                  variant="outline"
                  className="border-[#24CFA7] text-[#24CFA7] hover:bg-[#24CFA7] hover:text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Renew Existing Subscription
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <SubscriptionFeatures />

      {/* Pricing Section */}
      <div className="container mx-auto px-4 pb-20" style={{ backgroundColor: '#F0F5F9' }}>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600">
            Select the plan that best fits your career goals
          </p>
        </div>
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
    </div>
  );
}
