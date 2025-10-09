"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/common/Toast";
import { useRouter } from "next/navigation";

import { RenewalInfo } from "./types";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { ErrorMessage } from "./components/ErrorMessage";
import { CurrentSubscriptionCard } from "./components/CurrentSubscriptionCard";
import { RenewalCard } from "./components/RenewalCard";
import { PendingPaymentCard } from "./components/PendingPaymentCard";
import { useRenewalApi } from "./hooks/useRenewalApi";

export default function SubscriptionRenewalPage() {
  const [renewalInfo, setRenewalInfo] = useState<RenewalInfo | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  
  const { loading, error, fetchRenewalInfo, renewSubscription, uploadPaymentProof } = useRenewalApi();

  const loadRenewalData = async () => {
    const data = await fetchRenewalInfo();
    if (data) {
      setRenewalInfo(data);
    }
  };

  const handleRenew = async () => {
    if (!renewalInfo?.canRenew) return;

    setIsRenewing(true);
    const success = await renewSubscription();
    
    if (success) {
      setToastMessage("Renewal request created successfully!");
      setShowToast(true);
      await loadRenewalData();
    } else {
      setToastMessage("Failed to renew subscription");
      setShowToast(true);
    }
    
    setIsRenewing(false);
  };

  const handleUploadProof = async (file: File) => {
    if (!renewalInfo?.pendingPayment) return;

    const success = await uploadPaymentProof(renewalInfo.pendingPayment.id, file);
    
    if (success) {
      setToastMessage("Payment proof uploaded successfully! Waiting for approval.");
      setShowToast(true);
      await loadRenewalData();
    } else {
      setToastMessage("Failed to upload payment proof");
      setShowToast(true);
    }
  };

  const renderRightCard = () => {
    if (renewalInfo?.pendingPayment) {
      return (
        <PendingPaymentCard 
          pendingPayment={renewalInfo.pendingPayment}
          onUploadProof={handleUploadProof}
        />
      );
    }
    
    if (renewalInfo?.canRenew) {
      return (
        <RenewalCard 
          renewalInfo={renewalInfo}
          onRenew={handleRenew}
          isRenewing={isRenewing}
        />
      );
    }
    
    return (
      <Card className="border-gray-200">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {renewalInfo?.message || "Renewal not available at this time"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    loadRenewalData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadRenewalData} />;
  if (!renewalInfo) return <ErrorMessage message="No renewal information available" onRetry={loadRenewalData} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Renew Your Subscription
          </h1>
          <p className="text-gray-600">
            Continue enjoying premium features with subscription renewal
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CurrentSubscriptionCard subscription={renewalInfo.currentSubscription} />
          {renderRightCard()}
        </div>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => router.push("/subscription")}
          >
            Back to Subscription
          </Button>
        </div>
      </motion.div>

      <Toast 
        message={toastMessage}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
