import { useState, useEffect } from "react";
import { apiCall } from "@/helper/axios";

export function useSubscription() {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication first
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  // Check subscription status if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkSubscription();
    } else if (isAuthenticated === false) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      const subscriptionResponse = await apiCall.get(
        "/subscription/my-active-subscription"
      );

      // Check if response has isActive property (new format) or subscription data directly (current format)
      const hasActiveSubscription = 
        (subscriptionResponse.data && subscriptionResponse.data.isActive) || // New format
        (subscriptionResponse.data && 
         subscriptionResponse.data.status === 'ACTIVE' && 
         subscriptionResponse.data.expiresAt && 
         new Date(subscriptionResponse.data.expiresAt) > new Date()); // Current format with expiry check

      if (hasActiveSubscription) {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
      }
    } catch (error: any) {
      console.error("Subscription check error:", error);
      if (error.response?.status === 404) {
        setHasSubscription(false);
      } else {
        setHasSubscription(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const recheckSubscription = () => {
    if (isAuthenticated) {
      checkSubscription();
    }
  };

  return {
    hasSubscription,
    isLoading,
    isAuthenticated,
    recheckSubscription
  };
}
