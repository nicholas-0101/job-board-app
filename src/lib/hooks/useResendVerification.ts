"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";

export function useResendVerification() {
  const { user } = useUserStore();
  const [resending, setResending] = useState(false);

  const handleResend = async (token?: string) => {
    setResending(true);

    try {
      let email = user?.email;

      if (!email) {
        const pendingEmail = localStorage.getItem("pendingEmail");
        if (pendingEmail) {
          email = pendingEmail;
        }
      }

      if (!email && token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        email = payload?.email;
      }

      if (!email) {
        return {
          success: false,
          message: "User email not found. Please sign up again.",
        };
      }

      const res = await apiCall.post("/auth/resend-verification", { email });

      return {
        success: true,
        message: res.data.message || "Verification email resent successfully!",
      };
    } catch (err: any) {
      return {
        success: false,
        message:
          err.response?.data?.message || "Failed to resend verification email.",
      };
    } finally {
      setResending(false);
    }
  };

  return {
    resending,
    handleResend,
  };
}
