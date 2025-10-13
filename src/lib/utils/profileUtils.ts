"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

export function useProfileAccess() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!user) {
      const savedUser =
        localStorage.getItem("user") || localStorage.getItem("verifiedUser");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore invalid cached data
        }
      }
    }
  }, [user, setUser]);

  useEffect(() => {
    const evaluateAccess = () => {
      const storedCompletion = localStorage.getItem("isProfileComplete") === "true";
      const resolvedRole =
        user?.role ||
        (localStorage.getItem("role") as "ADMIN" | "USER" | null) ||
        null;

      if (storedCompletion || user?.isProfileComplete) {
        const target =
          resolvedRole === "ADMIN"
            ? "/admin"
            : resolvedRole === "USER"
            ? "/"
            : "/";
        router.replace(target);
        return;
      }

      setCheckingAccess(false);
    };

    evaluateAccess();
  }, [user, router]);

  return { checkingAccess };
}

export function getInitialValues(user: any) {
  return user?.role === "ADMIN"
    ? {
        phone: "",
        location: "",
        city: "",
        description: "",
        website: "",
        logoUrl: null,
      }
    : {
        phone: "",
        gender: "",
        dob: "",
        education: "",
        address: "",
        city: "",
        profilePicture: null,
      };
}

export function mapPayloadToInitialValues(payload: any) {
  if (!payload) return null;
  
  // Handle admin profile data
  if (payload.role === "ADMIN" || payload.user?.role === "ADMIN") {
    const adminData = payload.user || payload;
    return {
      phone: adminData.phone || "",
      location: adminData.location || "",
      city: adminData.city || "",
      description: adminData.description || "",
      website: adminData.website || "",
      logoUrl: adminData.logoUrl || null,
    };
  }
  
  // Handle user profile data
  const userData = payload.user || payload;
  return {
    phone: userData.phone || "",
    gender: userData.gender || "",
    dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
    education: userData.education || "",
    address: userData.address || "",
    city: userData.city || "",
    profilePicture: userData.profilePicture || null,
  };
}