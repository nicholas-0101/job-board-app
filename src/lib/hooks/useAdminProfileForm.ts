"use client";

import { useState } from "react";
import { useProfile } from "@/lib/hooks/useProfile";
import { useCompanyStore } from "@/lib/store/companyStore";
import { apiCall } from "@/helper/axios";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";

export function useAdminProfileForm() {
  const { user, initialValues, loadingProfile, setInitialValues } = useProfile();
  const { setCompany } = useCompanyStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleEditProfile = async (values: any, { resetForm }: any) => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, val]) => {
        if (val === undefined || val === null) return;

        if (val instanceof Blob) {
          formData.append(key, val);
        } else if (typeof val === "object") {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, String(val));
        }
      });

      const res = await apiCall.put("/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const payload = res.data?.data ?? res.data;
      if (payload?.role === "ADMIN" || payload?.adminId) {
        setCompany(payload);
        setInitialValues(mapPayloadToInitialValues(payload));
      }

      return {
        success: true,
        message: res.data?.message ?? "Profile updated successfully!",
        resetForm: () => resetForm({ values }),
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
    user,
    initialValues,
    loadingProfile,
    isSaving,
    handleEditProfile,
  };
}
