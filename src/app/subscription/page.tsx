"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { subscriptionPlans } from "@/components/subscription/subscriptionPlans";
import PlanCard from "@/components/subscription/PlanCard";

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
      <section className="relative bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/25 py-20">
        <div className="absolute inset-0" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 text-[#467EC7]">
              Choose Your <span className="text-[#24CFA7]">Perfect Plan</span>
            </h1>
            <p className="text-xl opacity-90 mb-8 text-muted-foreground">
              Unlock premium features and accelerate your career journey with
              our subscription plans
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 pb-20">
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
