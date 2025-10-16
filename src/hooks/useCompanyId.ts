import { useState, useEffect } from "react";
import { apiCall } from "@/helper/axios";

export function useCompanyId() {
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });

  const fetchCompanyId = async (): Promise<number> => {
    if (!companyId || Number.isNaN(companyId)) {
      try {
        const resp = await apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        const resolved = Number(data?.id ?? data?.data?.id);
        if (resolved) {
          setCompanyId(resolved);
          localStorage.setItem("companyId", resolved.toString());
          return resolved;
        }
      } catch {}
    }
    return companyId;
  };

  return { companyId, setCompanyId, fetchCompanyId };
}
