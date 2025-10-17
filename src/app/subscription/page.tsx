"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { subscriptionPlans } from "@/components/subscription/subscriptionPlans";
import PlanCard from "@/components/subscription/PlanCard";
// removed unused Button import after deleting renew button
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DeveloperBlockGuard from "@/components/auth/DeveloperBlockGuard";
import UserSubscriptionStatus from "../../components/subscription/UserSubscriptionStatus";
import UserTransactionStatus from "../../components/subscription/UserTransactionStatus";

export default function SubscriptionPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<string>("choose");

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
    <DeveloperBlockGuard>
      <div className="min-h-screen">
        {/* Header Section with Tabs */}
        <section className="relative bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/20 py-12 sm:py-16 md:py-20">
          <div className="absolute inset-0" />
          <div className="relative container mx-auto px-4 text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center items-center"
            >
              {activeTab === "choose" && (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#467EC7]">
                    Choose Your{" "}
                    <span className="text-[#24CFA7]">Perfect Plan</span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 text-muted-foreground max-w-3xl px-4">
                    Unlock premium features and accelerate your career journey
                    with our subscription plans.
                  </p>
                </>
              )}
              {activeTab === "status" && (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#467EC7]">
                    <span className="text-[#24CFA7]">Subscription</span> Status
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 text-muted-foreground max-w-3xl px-4">
                    View your active subscription status and history
                  </p>
                </>
              )}
              {activeTab === "transactions" && (
                <>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#467EC7]">
                    <span className="text-[#24CFA7]">Transaction</span> Status
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 text-muted-foreground max-w-3xl px-4">
                    Monitor your latest payments and their status
                  </p>
                </>
              )}

              <div className="w-full lg:max-w-5xl z-1 px-2 sm:px-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="h-8 sm:h-9 w-fit mx-auto">
                    <TabsTrigger
                      value="choose"
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Choose Plan</span>
                      <span className="sm:hidden">Plan</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="status"
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Subscription Status</span>
                      <span className="sm:hidden">Status</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="transactions"
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <span className="hidden sm:inline">Transaction Status</span>
                      <span className="sm:hidden">Transaction</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </section>

        {/* Content Section */}
        <section className="pb-8 sm:pb-12 lg:max-w-6xl mx-auto px-4">
          {activeTab === "choose" && (
            <div className="pb-12 sm:pb-20 pt-6 sm:pt-10">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Choose Your Plan
                </h2>
                <p className="text-base sm:text-xl text-gray-600 px-4">
                  Select the plan that best fits your career goals
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
                {subscriptionPlans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelectPlan={handlePlanSelection}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === "status" && (
            <AnimatePresence mode="wait">
              <motion.div
                key="status-content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="pb-12 sm:pb-16"
              >
                <UserSubscriptionStatus />
              </motion.div>
            </AnimatePresence>
          )}

          {activeTab === "transactions" && (
            <AnimatePresence mode="wait">
              <motion.div
                key="transactions-content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="pb-12 sm:pb-16"
              >
                <UserTransactionStatus />
              </motion.div>
            </AnimatePresence>
          )}
        </section>
      </div>
    </DeveloperBlockGuard>
  );
}
