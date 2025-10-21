"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft } from "lucide-react";
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

  const {
    loading,
    error,
    fetchRenewalInfo,
    renewSubscription,
    uploadPaymentProof,
  } = useRenewalApi();

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
      setToastMessage(error || "Failed to renew subscription");
      setShowToast(true);
    }

    setIsRenewing(false);
  };

  const handleUploadProof = async (file: File) => {
    if (!renewalInfo?.pendingPayment) return;

    const success = await uploadPaymentProof(
      renewalInfo.pendingPayment.slug ||
        renewalInfo.pendingPayment.id.toString(),
      file
    );

    if (success) {
      setToastMessage(
        "Payment proof uploaded successfully! Waiting for approval."
      );
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
      <Card className="border-[#A3B6CE]/30 bg-[#E1F1F3]/30">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-[#A3B6CE] mx-auto mb-4" />
            <p className="text-[#A3B6CE]">
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
  if (!renewalInfo)
    return (
      <ErrorMessage
        message="No renewal information available"
        onRetry={loadRenewalData}
      />
    );

  return (
    <div className="min-h-screen bg-[#F0F5F9] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header - Same as payment page */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/subscription")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subscription
          </Button>
          <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
            Renew Your Subscription
          </h1>
          <p className="text-[#A3B6CE]">
            Continue enjoying premium features with subscription renewal
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary - Left side (1/3 width) */}
          <div className="lg:col-span-1">
            <CurrentSubscriptionCard
              subscription={renewalInfo.currentSubscription}
            />
          </div>

          {/* Payment Information - Right side (2/3 width) */}
          <div className="lg:col-span-2">{renderRightCard()}</div>
        </div>

        <Toast
          message={toastMessage}
          show={showToast}
          onClose={() => setShowToast(false)}
        />
      </div>
    </div>
  );
}
