"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";

export function useVerifyAccount() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<
    "pending" | "success" | "error" | "expired" | "sent"
  >("pending");
  const [message, setMessage] = useState(
    "Click verify to confirm your account"
  );

  const handleVerify = async (token: string) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const res = await apiCall.get(`/auth/verify/${token}`);

      const verifiedUser = res.data.user;
      setUser(verifiedUser);
      localStorage.setItem("verifiedUser", JSON.stringify(verifiedUser));
      localStorage.setItem("user", JSON.stringify(verifiedUser));

      if (verifiedUser?.role) {
        localStorage.setItem("role", verifiedUser.role);
      }

      if (verifiedUser?.id) {
        localStorage.setItem("userId", verifiedUser.id.toString());
      }

      const verifiedToken = res.data.token;
      if (verifiedToken) {
        localStorage.setItem("verifiedToken", verifiedToken);
        localStorage.setItem("token", verifiedToken);
      }

      const isProfileComplete = Boolean(verifiedUser?.isProfileComplete);

      localStorage.setItem(
        "isProfileComplete",
        isProfileComplete ? "true" : "false"
      );

      setStatus("success");
      setMessage(res.data.message || "Account verified successfully!");

      const target =
        verifiedUser?.role === "ADMIN"
          ? isProfileComplete
            ? "/admin"
            : "/admin/profile/complete"
          : isProfileComplete
          ? "/"
          : "/profile/complete";

      router.replace(target);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || "Verification failed!";
      setMessage(msg);

      if (msg.toLowerCase().includes("expired")) {
        setStatus("expired");
      } else if (msg.toLowerCase().includes("already verified")) {
        setStatus("success");
      } else {
        setStatus("error");
      }
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    status,
    message,
    setStatus,
    setMessage,
    handleVerify,
  };
}
