"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";

export function useSignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (values: any, tab: "seeker" | "admin") => {
    setIsLoading(true);
    try {
      const { fullName, companyName, email, password, confirmPassword } = values;
      const payload =
        tab === "seeker"
          ? { name: fullName, email, password, confirmPassword, role: "USER" }
          : {
              name: companyName,
              email,
              password,
              confirmPassword,
              role: "ADMIN",
            };
      const url = tab === "seeker" ? "/auth/signup/user" : "/auth/signup/admin";
      await apiCall.post(url, payload);
      localStorage.setItem("pendingEmail", email);
      router.replace("/auth/preverify");
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Something went wrong",
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignUp,
  };
}
