"use client";

import { useState } from "react";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";
import { useCompanyStore } from "@/lib/store/companyStore";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";

export function useProfileEdit() {
  const { setUser } = useUserStore();
  const { setCompany } = useCompanyStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleEditProfile = async (values: any, setInitialValues: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      for (const key in values) {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      }

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = res.data?.data ?? res.data;
      if (payload?.role === "USER") {
        setUser(payload);
      } else if (payload?.role === "ADMIN" || payload?.adminId) {
        setCompany(payload);
      }

      if (payload) setInitialValues(mapPayloadToInitialValues(payload));
      
      return {
        success: true,
        message: res.data?.message ?? "Profile updated successfully!",
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile!",
      };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    handleEditProfile,
  };
}
