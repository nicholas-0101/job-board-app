"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Home,
  CreditCard,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AuthGuard from "@/components/auth/AuthGuard";
import TransactionLoading from "./components/TransactionLoading";
import TransactionError from "./components/TransactionError";
import { useTransactionData } from "./hooks/useTransactionData";

export default function TransactionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  
  const { transactionData, isLoading, error, isRefreshing, handleRefresh } = useTransactionData(paymentId);

  if (isLoading) {
    return <TransactionLoading />;
  }

  if (error || !transactionData) {
    return <TransactionError error={error} />;
  }

  const { subscription, payment, customer } = transactionData;

  return (
    <AuthGuard showWarning={true}>
      <div className="min-h-screen bg-[#F0F5F9] py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#24CFA7]/10 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-[#24CFA7]" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Payment Submitted Successfully!
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Thank you for your subscription. Your payment is being processed and will be activated once verified.
            </p>
          </motion.div>

          {/* Transaction Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Transaction Details
                  </div>
                  <Button 
                    onClick={handleRefresh} 
                    variant="outline" 
                    size="sm"
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Transaction ID</p>
                    <p className="font-semibold">#{payment?.id || paymentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plan</p>
                    <p className="font-semibold">{subscription?.plan?.planName || 'Subscription Plan'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold">IDR {payment?.amount?.toLocaleString() || subscription?.plan?.price?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <div className="flex items-center gap-2">
                      {payment?.status?.toLowerCase() === 'approved' || subscription?.status?.toLowerCase() === 'active' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-[#24CFA7]" />
                          <span className="text-[#24CFA7] font-medium">Approved & Active</span>
                        </>
                      ) : payment?.status?.toLowerCase() === 'rejected' ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-700 font-medium">Payment Rejected</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-[#467EC7]" />
                          <span className="text-[#467EC7] font-medium">Pending Verification</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-semibold">{customer.name}</p>
                  <p className="text-gray-600">{customer.email}</p>
                </div>

                <div className={`p-4 rounded-lg border ${
                  payment?.status?.toLowerCase() === 'approved' || subscription?.status?.toLowerCase() === 'active' 
                    ? 'bg-[#24CFA7]/5 border-[#24CFA7]/20' 
                    : payment?.status?.toLowerCase() === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-[#467EC7]/5 border-[#467EC7]/20'
                }`}>
                  <p className={`text-sm ${
                    payment?.status?.toLowerCase() === 'approved' || subscription?.status?.toLowerCase() === 'active' 
                      ? 'text-[#24CFA7]' 
                      : payment?.status?.toLowerCase() === 'rejected'
                      ? 'text-red-800'
                      : 'text-[#467EC7]'
                  }`}>
                    {payment?.status?.toLowerCase() === 'approved' || subscription?.status?.toLowerCase() === 'active' ? (
                      <><strong>🎉 Congratulations!</strong> Your payment has been approved and your subscription is now active. You can now access all premium features.</>
                    ) : payment?.status?.toLowerCase() === 'rejected' ? (
                      <><strong>❌ Payment Rejected:</strong> Your payment was not approved. Please contact support or try again with a different payment method.</>
                    ) : (
                      <><strong>Processing time:</strong> 1-2 business days for manual verification. You'll receive an email confirmation once your subscription is active.</>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Button onClick={() => router.push("/")} variant="outline" size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <Button onClick={() => router.push("/subscription")} size="lg" className="bg-[#467EC7] hover:bg-[#467EC7]/90">
              <ArrowRight className="w-4 h-4 mr-2" />
              View My Subscriptions
            </Button>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
