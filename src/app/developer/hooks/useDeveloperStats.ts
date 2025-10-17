import { useState, useEffect } from "react";

export interface DeveloperStats {
  totalAssessments: number;
  pendingApprovals: number;
  certificatesIssued: number;
  [key: string]: number;
}

export function useDeveloperStats() {
  const [stats, setStats] = useState<DeveloperStats>({
    totalAssessments: 0,
    pendingApprovals: 0,
    certificatesIssued: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setTimeout(() => {
        setStats({
          totalAssessments: 25,
          pendingApprovals: 8,
          certificatesIssued: 142,
        });
        setIsLoading(false);
      }, 1000);
    };

    fetchStats();
  }, []);

  return { stats, isLoading };
}
