import { useState } from "react";
import { RenewalInfo } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4400';

export const useRenewalApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchRenewalInfo = async (): Promise<RenewalInfo | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/renewal-info`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch renewal information: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const renewSubscription = async (): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/renew`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to renew subscription");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to renew subscription";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadPaymentProof = async (paymentId: number, file: File): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("paymentProof", file);

      const response = await fetch(`${API_BASE_URL}/subscription/payments/${paymentId}/upload-proof`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload payment proof");
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload payment proof";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchRenewalInfo,
    renewSubscription,
    uploadPaymentProof,
  };
};
