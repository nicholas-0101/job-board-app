import { useEffect, useState } from "react";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";
import { useCompanyStore } from "@/lib/store/companyStore";
import { mapPayloadToInitialValues } from "@/lib/utils/profileUtils";

export const useProfile = () => {
  const { user, setUser } = useUserStore();
  const { setCompany } = useCompanyStore();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [initialValues, setInitialValues] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        
        console.log("🔑 Token exists:", !!token);
        console.log("👤 Role from localStorage:", role);
        
        if (!token) {
          console.warn("⚠️ No token found");
          if (mounted) setLoadingProfile(false);
          return;
        }

        if (!role) {
          console.warn("⚠️ No role found in localStorage");
          if (mounted) setLoadingProfile(false);
          return;
        }

        // Use the same endpoints as dashboard for consistency
        const endpoint = role === "ADMIN" ? "/company/admin" : "/profile/user";

        console.log("🔍 Fetching profile from:", endpoint);

        const res = await apiCall.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // For /company/admin, data is returned directly (not in .data)
        // For /profile/user, data is in .data
        const payload = role === "ADMIN" ? res.data : (res.data?.data ?? res.data);
        
        console.log("✅ Received payload:", payload);

        if (!user || user.id !== payload.id) {
          setUser(payload);
        }

        if (payload?.ownerAdminId !== undefined || payload?.slug !== undefined) {
          setCompany(payload);
        } else {
          setCompany(null);
        }

        if (mounted) {
          const mappedValues = mapPayloadToInitialValues(payload);
          console.log("🎯 Mapped initial values:", mappedValues);
          console.log("🔍 Payload structure:", {
            hasRole: !!payload.role,
            hasUser: !!payload.user,
            hasAdminId: !!payload.adminId,
            hasOwnerAdminId: !!payload.ownerAdminId,
            hasName: !!payload.name,
            hasEmail: !!payload.email,
            payloadKeys: Object.keys(payload)
          });
          
          if (mappedValues) {
            setInitialValues(mappedValues);
          } else {
            console.error("❌ Mapping returned null!");
          }
        }
      } catch (err: any) {
        console.error("❌ fetchProfile error:", err);
        console.error("❌ Error details:", err?.response?.data || err?.message);
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    };

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token && role) {
      console.log("🚀 Starting profile fetch...");
      fetchProfile();
    } else {
      console.warn("⚠️ Missing token or role, skipping fetch");
      setLoadingProfile(false);
    }

    return () => {
      mounted = false;
    };
  }, [setUser, setCompany]);

  return { user, initialValues, loadingProfile, setInitialValues };
};