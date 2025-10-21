import { useEffect, useState } from "react";
import { apiCall } from "@/helper/axios";

interface CompanyInfoState {
  companyInfo: any;
  loading: boolean;
}

export const useCompanyInfo = (): CompanyInfoState => {
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const resp = await apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        setCompanyInfo(data ?? null);

        if (data?.id) {
          localStorage.setItem("companyId", data.id.toString());
        }
      } catch (err: any) {
        console.error("Failed to load company info:", err);

        if (err?.response?.status === 500) {
          console.warn(
            "Server error loading company info - this is expected for new admins"
          );
        } else if (err?.response?.status === 404) {
          console.warn("Company not found - admin needs to complete profile");
          if (err?.response?.data?.needsProfileCompletion) {
            console.info(
              "Admin needs to complete profile to create company record"
            );
          }
        }

        setCompanyInfo(null);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchCompanyInfo, 120);
    return () => clearTimeout(timer);
  }, []);

  return { companyInfo, loading };
};
