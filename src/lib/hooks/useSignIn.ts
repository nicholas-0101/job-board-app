"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { apiCall } from "@/helper/axios";

export function useSignIn() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Validate input
      if (!values.email || !values.password) {
        return {
          success: false,
          message: "Email and password are required.",
        };
      }
      
      // Sanitize input
      const sanitizedValues = {
        email: values.email.trim().toLowerCase(),
        password: values.password,
      };
      
      const res = await apiCall.post("/auth/signin", sanitizedValues);
      const { token, user } = res.data;

      // Validate response data
      if (!token || !user || !user.id || !user.role) {
        throw new Error("Invalid response from server");
      }

      const isProfileComplete = Boolean(user.isProfileComplete);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id.toString());
      localStorage.setItem(
        "isProfileComplete",
        isProfileComplete ? "true" : "false"
      );

      // Get company ID for admin
      if (user.role === "ADMIN") {
        try {
          const companyResponse = await apiCall.get("/company/admin", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const companyId = Number(
            companyResponse.data?.id ?? companyResponse.data?.data?.id
          );
          if (!Number.isNaN(companyId)) {
            localStorage.setItem("companyId", companyId.toString());
          }
        } catch (err) {
          // Ignore company fetch error
        }
      }

      setUser({ ...user, isProfileComplete });

      if (user.role === "ADMIN") {
        router.replace(
          isProfileComplete ? "/admin" : "/admin/profile/complete"
        );
      } else {
        router.replace(isProfileComplete ? "/" : "/profile/complete");
      }

      return { success: true };
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Sign in failed";
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSignIn,
  };
}
