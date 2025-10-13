"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: number;
  userId: number;
  [key: string]: any;
}

export function useJobDetailCard(job: any) {
  const router = useRouter();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [openShare, setOpenShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Notice");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);
  const [preselectionStatus, setPreselectionStatus] = useState<{
    required: boolean;
    submitted?: boolean;
    score?: number | null;
    passingScore?: number | null;
    isPassed?: boolean;
  } | null>(null);

  const openDialog = (title: string, message: string, action?: () => void) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogAction(() => action || null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    dialogAction?.();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch preselection test status if authenticated
  useEffect(() => {
    const checkPreselectionStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token || !job.id) return;

      try {
        const response = await apiCall.get(
          `/preselection/jobs/${job.id}/my-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPreselectionStatus(response.data.data);
      } catch (error: any) {
        // Silently ignore 404 (no test for this job)
        if (error.response?.status !== 404) {
          console.error("Failed to check preselection status:", error);
        }
      }
    };

    if (isAuthenticated) {
      checkPreselectionStatus();
    }
  }, [isAuthenticated, job.id]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.userId;
      apiCall
        .get(`/save/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const savedJobs = res.data.data;
          setSaved(
            savedJobs.some((savedJob: any) => savedJob.job.id === job.id)
          );
        })
        .catch((err) => console.error("Failed to fetch saved jobs", err));
    }
  }, [job.id]);

  const handlePretestClick = () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }
    router.push(`/jobs/${job.slug}/pretest`);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }

    // Redirect if test is required but not completed or failed
    if (preselectionStatus?.required && !preselectionStatus?.submitted) {
      openDialog(
        "You can't apply this job",
        "Please complete the pre-selection test before applying for this job.",
        () => router.push(`/jobs/${job.slug}/pretest`)
      );
      return;
    }

    if (
      preselectionStatus?.required &&
      preselectionStatus?.submitted &&
      !preselectionStatus?.isPassed
    ) {
      openDialog(
        "You can't apply this job",
        "Your pre-selection test score does not meet the passing criteria for this job.",
        () => router.replace(`/explore/jobs/${job.slug}`)
      );
      return;
    }
    router.push(`/jobs/${job.slug}/apply`);
  };

  const toggleSaveJob = async () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      if (!saved) {
        await apiCall.post(
          `/save/${job.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSaved(true);
      } else {
        await apiCall.delete(`/save/unsave/${job.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(false);
      }
    } catch (err) {
      console.error("Failed to toggle save job", err);
    }
  };

  const handleShareClick = () => {
    setOpenShare(true);
  };

  const closeShare = () => {
    setOpenShare(false);
  };

  return {
    isAuthenticated,
    openShare,
    saved,
    dialogOpen,
    dialogTitle,
    dialogMessage,
    preselectionStatus,
    handlePretestClick,
    handleApplyClick,
    toggleSaveJob,
    handleShareClick,
    closeShare,
    closeDialog,
  };
}
