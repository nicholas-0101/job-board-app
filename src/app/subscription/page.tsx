"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { subscriptionPlans } from "@/components/subscription/subscriptionPlans";
import PlanCard from "@/components/subscription/PlanCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import DeveloperBlockGuard from "@/components/auth/DeveloperBlockGuard";
import UserSubscriptionStatus from "../../components/subscription/UserSubscriptionStatus";
import UserTransactionStatus from "../../components/subscription/UserTransactionStatus";

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
    <DeveloperBlockGuard>
      <div className="min-h-screen container mx-auto px-4 py-8 sm:py-12">
        <Tabs defaultValue="choose" className="w-full">
          <TabsList className="mb-6 sm:mb-8">
            <TabsTrigger value="choose">Choose Plan</TabsTrigger>
            <TabsTrigger value="status">Subscription Status</TabsTrigger>
            <TabsTrigger value="transactions">Transaction Status</TabsTrigger>
          </TabsList>

          <TabsContent value="choose">
            {/* Hero Section */}
            <section className="relative py-8 sm:py-12 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/20 rounded-xl">
              <div className="relative container mx-auto px-4 text-center max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-[#467EC7]">
                    Choose Your{" "}
                    <span className="text-[#24CFA7]">Perfect Plan</span>
                  </h1>
                  <p className="text-base sm:text-xl mb-6 sm:mb-8 text-gray-600 px-4">
                    Unlock premium features and accelerate your career journey
                    with our subscription plans.
                  </p>

                  {isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="mb-4 sm:mb-6"
                    >
                      <Button
                        onClick={() => router.push("/subscription/renew")}
                        variant="outline"
                        className="border-[#24CFA7] text-[#24CFA7] hover:bg-[#24CFA7] hover:text-white text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2"
                      >
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Renew Existing Subscription
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </section>

            {/* Pricing Section */}
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
          </TabsContent>

          <TabsContent value="status">
            <section className="relative py-8 sm:py-12 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/20 rounded-xl mb-6">
              <div className="relative container mx-auto px-4 text-center max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-[#467EC7]">
                    Subscription Status
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 px-4">
                    Lihat status langganan aktif dan riwayat Anda
                  </p>
                </motion.div>
              </div>
            </section>
            <div className="pb-12 sm:pb-16">
              <UserSubscriptionStatus />
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <section className="relative py-8 sm:py-12 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/20 rounded-xl mb-6">
              <div className="relative container mx-auto px-4 text-center max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-[#467EC7]">
                    Transaction Status
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600 px-4">
                    Pantau pembayaran terbaru dan statusnya
                  </p>
                </motion.div>
              </div>
            </section>
            <div className="pb-12 sm:pb-16">
              <UserTransactionStatus />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DeveloperBlockGuard>
  );
}
