import { useState, useEffect } from "react";
import { apiCall } from "@/helper/axios";

interface SubscriptionData {
  isActive?: boolean;
  status?: string;
  expiresAt?: string;
}

// Helper functions (max 15 lines each)
const checkAuthToken = (): boolean => {
  const token = localStorage.getItem("token");
  return !!token;
};

const isSubscriptionActive = (data: SubscriptionData): boolean => {
  // New format check
  if (data.isActive !== undefined) {
    return data.isActive;
  }
  
  // Legacy format check
  if (data.status === 'ACTIVE' && data.expiresAt) {
    return new Date(data.expiresAt) > new Date();
  }
  
  return false;
};

const handleSubscriptionError = (error: any): boolean => {
  if (error.response?.status === 404) {
    return false; // No subscription found
  }
  return false; // Default to no subscription on error
};

export function useSubscription() {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication
  useEffect(() => {
    setIsAuthenticated(checkAuthToken());
  }, []);

  // Check subscription when authenticated
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
      const response = await apiCall.get("/subscription/my-active-subscription");
      const isActive = isSubscriptionActive(response.data);
      setHasSubscription(isActive);
    } catch (error: any) {
      const hasActive = handleSubscriptionError(error);
      setHasSubscription(hasActive);
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
