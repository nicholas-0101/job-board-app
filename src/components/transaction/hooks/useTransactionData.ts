import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  fetchUserSubscriptions,
  fetchUserData,
  findPaymentInSubscription,
  searchPaymentInAllSubscriptions,
  createBasicPaymentObject,
  buildTransactionData
} from "../helpers/transactionHelpers";

export const useTransactionData = (paymentId: string | null) => {
  const [transactionData, setTransactionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTransactionData = async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    }
    
    try {
      const subscriptions = await fetchUserSubscriptions();
      
      if (!subscriptions || subscriptions.length === 0) {
        throw new Error("No subscriptions found");
      }
      
      const latestSubscription = subscriptions[subscriptions.length - 1];
      const userData = await fetchUserData();
      
      let payment = await findPaymentInSubscription(latestSubscription.id, paymentId || "");
      
      if (!payment && paymentId) {
        payment = await searchPaymentInAllSubscriptions(subscriptions, paymentId);
        
        if (!payment) {
          payment = createBasicPaymentObject(paymentId, latestSubscription);
        }
      }
      
      const transactionData = buildTransactionData(latestSubscription, payment, userData);
      setTransactionData(transactionData);
      
    } catch (error: any) {
      setError("Failed to load transaction details");
      if (isRefresh) {
        toast.error("Failed to refresh transaction details");
      } else {
        toast.error("Failed to load transaction details");
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (paymentId) {
      loadTransactionData();
    } else {
      setError("Payment ID not found");
      setIsLoading(false);
    }
  }, [paymentId]);

  const handleRefresh = () => {
    loadTransactionData(true);
  };

  return {
    transactionData,
    isLoading,
    error,
    isRefreshing,
    handleRefresh
  };
};
