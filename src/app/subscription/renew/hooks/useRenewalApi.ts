import { useState } from "react";
import { RenewalInfo } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_BE_URL || "http://localhost:4400";

export const useRenewalApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchRenewalInfo = async (): Promise<RenewalInfo | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log("=== FETCH RENEWAL INFO ===");
      console.log("API URL:", `${API_BASE_URL}/subscription/renewal-info`);
      console.log(
        "Token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );

      const response = await fetch(
        `${API_BASE_URL}/subscription/renewal-info`,
        {
          headers: getAuthHeaders(),
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorDetail;
        try {
          errorDetail = await response.json();
        } catch {
          errorDetail = await response.text();
        }
        console.error("Error response:", errorDetail);
        throw new Error(
          `Failed to fetch renewal information: ${
            response.status
          } ${JSON.stringify(errorDetail)}`
        );
      }

      const data = await response.json();
      console.log("Renewal info data:", data);
      return data;
    } catch (err) {
      console.error("=== FETCH RENEWAL INFO ERROR ===");
      console.error("Error:", err);
      console.error(
        "Error type:",
        err instanceof Error ? err.constructor.name : typeof err
      );
      console.error(
        "Error message:",
        err instanceof Error ? err.message : String(err)
      );
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
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
      console.log("=== RENEW SUBSCRIPTION ===");
      console.log("API URL:", `${API_BASE_URL}/subscription/renew`);
      console.log(
        "Token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );

      const response = await fetch(`${API_BASE_URL}/subscription/renew`, {
        method: "POST",
        headers: getAuthHeaders(),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        let errorDetail;
        try {
          errorDetail = await response.json();
        } catch {
          errorDetail = await response.text();
        }
        console.error("Error response:", errorDetail);
        throw new Error(
          `Failed to renew: ${response.status} - ${JSON.stringify(errorDetail)}`
        );
      }

      const data = await response.json();
      console.log("Renew response data:", data);
      return true;
    } catch (err) {
      console.error("=== RENEW SUBSCRIPTION ERROR ===");
      console.error("Error:", err);
      console.error(
        "Error type:",
        err instanceof Error ? err.constructor.name : typeof err
      );
      console.error(
        "Error message:",
        err instanceof Error ? err.message : String(err)
      );
      const errorMessage =
        err instanceof Error ? err.message : "Failed to renew subscription";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const uploadPaymentProof = async (
    paymentSlug: string,
    file: File
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("paymentProof", file);

      // Use slug-based endpoint for better security
      const response = await fetch(
        `${API_BASE_URL}/subscription/payments/slug/${paymentSlug}/upload-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload payment proof");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload payment proof";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fallback function for backward compatibility
  const uploadPaymentProofById = async (
    paymentId: number,
    file: File
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("paymentProof", file);

      const response = await fetch(
        `${API_BASE_URL}/subscription/payments/${paymentId}/upload-proof`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload payment proof");
      }

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload payment proof";
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
    uploadPaymentProofById, // Export fallback function
  };
};
