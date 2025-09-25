"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useTransaction } from "./useTransaction";
import OrderSummary from "./OrderSummary";
import PaymentForm from "./PaymentForm";

export default function TransactionContent() {
  const router = useRouter();
  const {
    selectedPlan,
    paymentMethod,
    paymentProof,
    isSubmitting,
    setPaymentMethod,
    handleFileUpload,
    handleSubmitTransaction,
  } = useTransaction();

  if (!selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transaction details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard showWarning={true}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Subscription
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">
              You're subscribing to the {selectedPlan.name} plan
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary selectedPlan={selectedPlan} />
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <PaymentForm
                selectedPlan={selectedPlan}
                paymentMethod={paymentMethod}
                paymentProof={paymentProof}
                isSubmitting={isSubmitting}
                onPaymentMethodChange={setPaymentMethod}
                onFileUpload={handleFileUpload}
                onSubmit={handleSubmitTransaction}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
