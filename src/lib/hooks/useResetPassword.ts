"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";

export function useResetPassword() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      await apiCall.post(`/auth/reset-password/${token}`, {
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      router.replace("/auth/signin");
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Reset failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleReset,
  };
}
