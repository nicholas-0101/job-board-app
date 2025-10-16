"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";

export function useProfileCompletion() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCompleteProfile = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    try {
      if (values.dob) values.dob = new Date(values.dob).toISOString();
      const formData = new FormData();
      
      const fieldMapping: Record<string, string> = {
        address: 'location',        
        locationCity: 'city',      
      };
      
      for (const key in values) {
        if (values[key]) {
          const backendKey = fieldMapping[key] || key;
          formData.append(backendKey, values[key]);
        }
      }

      const res = await apiCall.put("/profile/complete", formData);
      const payload = res.data?.data;

      const currentRole =
        user?.role ||
        (localStorage.getItem("role") as "ADMIN" | "USER" | null) ||
        (payload?.user?.role ?? payload?.role ?? null);

      let nextUser = user ?? null;

      if (currentRole === "ADMIN") {
        const updatedUser = payload?.user ?? payload;
        nextUser = {
          ...(user ?? {}),
          ...(updatedUser ?? {}),
          isProfileComplete: true,
        };

        const companyId =
          payload?.company?.id ?? payload?.company?.data?.id ?? null;
        if (companyId) {
          localStorage.setItem("companyId", companyId.toString());
        }
      } else {
        nextUser = {
          ...(user ?? {}),
          ...(payload ?? {}),
          isProfileComplete: true,
        };
      }

      if (nextUser) {
        try {
          localStorage.setItem("user", JSON.stringify(nextUser));
        } catch {
          // ignore storage write errors
        }
        setUser(nextUser as any);
      }

      localStorage.setItem("isProfileComplete", "true");
      if (currentRole) {
        localStorage.setItem("role", currentRole);
      }
      if (nextUser && "id" in nextUser && nextUser.id) {
        localStorage.setItem("userId", nextUser.id.toString());
      }

      resetForm();

      if (currentRole === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          err.message ||
          "Failed to complete profile!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleCompleteProfile,
  };
}
