import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiCall } from "@/helper/axios";
import { SubscriptionPlan, subscriptionPlans } from "./types";

export function useTransaction() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan");
  
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  useEffect(() => {
    if (planId && subscriptionPlans[planId as keyof typeof subscriptionPlans]) {
      setSelectedPlan(subscriptionPlans[planId as keyof typeof subscriptionPlans]);
      loadBackendPlans();
    } else {
      // Redirect back to subscription page if no valid plan
      router.push("/subscription");
    }
  }, [planId, router]);

  const loadBackendPlans = async () => {
    try {
      await apiCall.get("/subscription/plans");
    } catch (error) {
      toast.error("Failed to load subscription plans");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setPaymentProof(file);
      toast.success("Payment proof uploaded successfully");
    }
  };

  const handleSubmitTransaction = async () => {
    if (!selectedPlan) return;

    // Validate required fields - only payment proof needed now
    if (paymentMethod === "transfer" && !paymentProof) {
      toast.error("Please upload payment proof for bank transfer");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Step 1: Get backend plans to find correct planId
      const plansResponse = await apiCall.get("/subscription/plans");
      const backendPlans = plansResponse.data;
      
      // Validate backend plans data
      if (!Array.isArray(backendPlans)) {
        toast.error("Failed to load subscription plans");
        setIsSubmitting(false);
        return;
      }
      
      
      // Find matching plan by name (case insensitive and flexible matching)
      let matchingPlan = backendPlans.find((plan: any) => {
        if (!plan || !selectedPlan?.name) {
          return false;
        }
        
        // Try multiple field names that might contain the plan name
        const planName = plan.planName || plan.name || plan.title || '';
        const selectedName = selectedPlan.name || '';
        
        if (!planName || !selectedName) {
          return false;
        }
        
        // Case insensitive comparison with trimmed whitespace
        const normalizedPlanName = planName.toString().toLowerCase().trim();
        const normalizedSelectedName = selectedName.toString().toLowerCase().trim();
        
        // Exact match or contains match
        return normalizedPlanName === normalizedSelectedName || 
               normalizedPlanName.includes(normalizedSelectedName) ||
               normalizedSelectedName.includes(normalizedPlanName);
      });
      
      // Fallback: Try matching by common plan types if name matching fails
      if (!matchingPlan && selectedPlan?.name) {
        const selectedLower = selectedPlan.name.toLowerCase();
        matchingPlan = backendPlans.find((plan: any) => {
          const planName = (plan.planName || plan.name || plan.title || '').toLowerCase();
          
          // Check for common plan type keywords
          if (selectedLower.includes('professional') && planName.includes('professional')) return true;
          if (selectedLower.includes('standard') && planName.includes('standard')) return true;
          if (selectedLower.includes('basic') && planName.includes('basic')) return true;
          if (selectedLower.includes('premium') && planName.includes('premium')) return true;
          
          return false;
        });
      }
      
      if (!matchingPlan) {
        const availablePlans = backendPlans.map(p => p.planName || p.name || p.title || 'Unnamed').join(', ');
        toast.error(`Selected plan "${selectedPlan?.name || 'Unknown'}" not found. Available plans: ${availablePlans}`);
        setIsSubmitting(false);
        return;
      }

      // Step 2: Subscribe user to plan
      
      // Check authentication token
      const token = localStorage.getItem("token") || localStorage.getItem("verifiedToken");
      if (!token) {
        toast.error("Please sign in to subscribe");
        setIsSubmitting(false);
        return;
      }
      
      // Ensure planId is sent as integer
      const planId = typeof matchingPlan.id === 'string' ? parseInt(matchingPlan.id) : matchingPlan.id;
      
      const subscribeResponse = await apiCall.post("/subscription/subscribe", {
        planId: planId
      });

      const paymentId = subscribeResponse.data.payment.id;

      // Step 3: Upload payment proof if bank transfer
      if (paymentMethod === "transfer" && paymentProof) {
        const formData = new FormData();
        formData.append("paymentProof", paymentProof);

        // Don't set Content-Type manually for FormData - let browser handle it
        await apiCall.post(`/subscription/payments/${paymentId}/upload-proof`, formData, {
          headers: {
            'Content-Type': undefined, // Remove default application/json
          },
        });
      }

      toast.success("Transaction submitted successfully!");
      router.push(`/transaction/success?paymentId=${paymentId}`);
      
    } catch (error: any) {
      
      if (error.response?.status === 401) {
        toast.error("Please sign in to subscribe");
      } else if (error.response?.status === 400) {
        const message = error.response?.data?.message;
        const errorDetail = error.response?.data?.error;
        
        if (message?.includes("already has an active subscription")) {
          toast.error("You already have an active subscription");
        } else if (message?.includes("File upload error")) {
          toast.error(`Upload error: ${errorDetail || message}`);
        } else {
          toast.error(message || "Failed to submit transaction");
        }
      } else if (error.response?.status === 500) {
        const message = error.response?.data?.message || error.response?.data?.error;
        toast.error(`Server error: ${message || "Internal server error"}`);
      } else {
        toast.error("Failed to submit transaction. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    selectedPlan,
    paymentMethod,
    paymentProof,
    isSubmitting,
    setPaymentMethod,
    handleFileUpload,
    handleSubmitTransaction,
  };
}
