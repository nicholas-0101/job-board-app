"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  FileText,
  ArrowRight,
  Home,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiCall } from "@/helper/axios";
import AuthGuard from "@/components/auth/AuthGuard";
import toast from "react-hot-toast";

export default function TransactionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (paymentId) {
      loadTransactionData();
    } else {
      setError("Payment ID not found");
      setIsLoading(false);
    }
  }, [paymentId]);

  // Removed auto-refresh - user can manually refresh browser to get latest status

  const loadTransactionData = async () => {
    try {
      // Get user's subscriptions
      const subscriptionsResponse = await apiCall.get("/subscription/my-subscriptions");
      
      // Find the latest subscription (assuming it's the one we just created)
      const subscriptions = subscriptionsResponse.data;
      if (!subscriptions || subscriptions.length === 0) {
        throw new Error("No subscriptions found");
      }
      
      // Get the latest subscription
      const latestSubscription = subscriptions[subscriptions.length - 1];
      
      // Get current user data separately
      const userResponse = await apiCall.get("/auth/keep");
      const userData = userResponse.data.data; // Note: response has { success: true, data: userData }
      
      // Get payments for this subscription
      const paymentsResponse = await apiCall.get(`/subscription/subscriptions/${latestSubscription.id}/payments`);
      
      // Find the payment that matches our paymentId
      const payments = paymentsResponse.data;
      
      let payment = payments.find((p: any) => p.id.toString() === paymentId);
      
      if (!payment && paymentId) {
        // If not found in subscription payments, try to get payment directly
        try {
          const directPaymentResponse = await apiCall.get(`/subscription/payments/${paymentId}`);
          payment = directPaymentResponse.data;
        } catch (directError) {
          console.error("Could not find payment:", directError);
        }
      }
      
      setTransactionData({
        subscription: latestSubscription,
        payment: payment,
        customer: {
          name: userData.fullName || userData.name || "Customer",
          email: userData.email || "customer@example.com"
        }
      });
      
    } catch (error: any) {
      console.error("Error loading transaction data:", error);
      setError("Failed to load transaction details");
      toast.error("Failed to load transaction details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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

  if (error || !transactionData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-red-900 mb-4">
                  Transaction Error
                </h2>
                <p className="text-red-800 mb-6">
                  {error || "Unable to load transaction details"}
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push("/subscription")} variant="outline">
                    Back to Subscription
                  </Button>
                  <Button onClick={() => router.push("/")} className="bg-red-600 hover:bg-red-700">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { subscription, payment, customer } = transactionData;

  return (
    <AuthGuard showWarning={true}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
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
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Transaction Details
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
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-700 font-medium">Approved & Active</span>
                        </>
                      ) : payment?.status?.toLowerCase() === 'rejected' ? (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                          <span className="text-red-700 font-medium">Payment Rejected</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span className="text-yellow-700 font-medium">Pending Verification</span>
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
                    ? 'bg-green-50 border-green-200' 
                    : payment?.status?.toLowerCase() === 'rejected'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <p className={`text-sm ${
                    payment?.status?.toLowerCase() === 'approved' || subscription?.status?.toLowerCase() === 'active' 
                      ? 'text-green-800' 
                      : payment?.status?.toLowerCase() === 'rejected'
                      ? 'text-red-800'
                      : 'text-blue-800'
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
            <Button onClick={() => router.push("/subscription")} size="lg">
              <ArrowRight className="w-4 h-4 mr-2" />
              View My Subscriptions
            </Button>
          </motion.div>
        </div>
      </div>
    </AuthGuard>
  );
}
