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
        address: "",
        locationCity: "",
        description: "",
        website: "",
        logoUrl: null,
        socials: {
          facebook: "",
          twitter: "",
          linkedin: "",
          instagram: "",
        },
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
  
  // Handle admin profile data - check for admin-specific fields
  // The /company/admin endpoint returns company data directly
  if (payload.role === "ADMIN" || payload.user?.role === "ADMIN" || 
      (payload.adminId !== undefined || payload.ownerAdminId !== undefined ||
       payload.name !== undefined || payload.email !== undefined) &&
      !payload.gender && !payload.dob && !payload.education) {
    const adminData = payload.user || payload;
    
    // Try multiple possible field names for each field
    const address = adminData.location || adminData.address || adminData.fullAddress || "";
    const city = adminData.locationCity || adminData.city || "";
    const logo = adminData.logoUrl || adminData.logo || null;
    
    console.log("🔍 Admin data fields:", {
      location: adminData.location,
      address: adminData.address,
      fullAddress: adminData.fullAddress,
      locationCity: adminData.locationCity,
      city: adminData.city,
      logoUrl: adminData.logoUrl,
      logo: adminData.logo,
      allKeys: Object.keys(adminData)
    });
    
    return {
      phone: adminData.phone || "",
      address: address,
      locationCity: city,
      description: adminData.description || "",
      website: adminData.website || "",
      logoUrl: logo,
      socials: {
        facebook: adminData.socials?.facebook || "",
        twitter: adminData.socials?.twitter || "",
        linkedin: adminData.socials?.linkedin || "",
        instagram: adminData.socials?.instagram || "",
      },
    };
  }
  
  // Handle user profile data
  const userData = payload.user || payload;
  
  console.log("🔍 User data fields:", {
    phone: userData.phone,
    gender: userData.gender,
    dob: userData.dob,
    education: userData.education,
    address: userData.address,
    city: userData.city,
    profilePicture: userData.profilePicture,
    allKeys: Object.keys(userData)
  });
  
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