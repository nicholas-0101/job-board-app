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
        if (!token) return;

        const endpoint =
          user?.role === "ADMIN" ? "/profile/admin" : "/profile/user";

        const res = await apiCall.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const payload = res.data?.data ?? res.data;

        if (payload?.role === "ADMIN" || payload?.adminId) {
          setCompany(payload);
          setUser({ ...user, ...payload });
        } else {
          setUser(payload);
          setCompany(null);
        }

        setInitialValues(mapPayloadToInitialValues(payload));
      } catch (err) {
        console.error("fetchProfile error:", err);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [user?.role, setUser, setCompany]);

  return { user, initialValues, loadingProfile, setInitialValues };
};