"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";

export function useJobApplication() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [success, setSuccess] = useState(false);
  const [jobName, setJobName] = useState("");
  const [jobId, setJobId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
  const [checkingPreselection, setCheckingPreselection] = useState(true);

  const initialValues = {
    expectedSalary: "",
    cvFile: null as File | null,
  };

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
    async function fetchJob() {
      try {
        const response = await apiCall.get(`/job/${slug}`);
        const job = response.data.data;
        setJobName(job.title);
        setJobId(job.id);
      } catch (err) {
        console.error("Failed to fetch job name", err);
      }
    }

    if (slug) fetchJob();
  }, [slug]);

  // Check preselection test status
  useEffect(() => {
    const checkPreselectionStatus = async () => {
      if (!jobId) return;

      try {
        const response = await apiCall.get(
          `/preselection/jobs/${jobId}/my-status`
        );
        const status = response.data.data;
        setPreselectionStatus(status);

        // Redirect if test is required but not completed or failed
        if (status.required && !status.submitted) {
          openDialog("You can't apply this job", "Please complete the pre-selection test before applying for this job.", () =>
            router.push(`/jobs/${slug}/pretest`)
          );
          return;
        }

        if (status.required && status.submitted && !status.isPassed) {
          openDialog("You can't apply this job", "Your pre-selection test score does not meet the passing criteria for this job.", () =>
            router.replace(`/explore/jobs/${slug}`)
          );
          return;
        }
      } catch (error) {
        console.error("Failed to check preselection status:", error);
      } finally {
        setCheckingPreselection(false);
      }
    };

    if (jobId) {
      checkPreselectionStatus();
    }
  }, [jobId, slug, router]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("expectedSalary", values.expectedSalary);
      if (values.cvFile) {
        formData.append("cvFile", values.cvFile);
      }

      await apiCall.post(`/application/${slug}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      openDialog("Submitted!", "Application submitted successfully!", () =>
        router.replace(`/explore/jobs/${slug}`)
      );
    } catch (err: any) {
      openDialog(
        "Error",
        err.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    slug,
    success,
    jobName,
    jobId,
    isLoading,
    dialogOpen,
    dialogTitle,
    dialogMessage,
    preselectionStatus,
    checkingPreselection,
    initialValues,
    handleSubmit,
    closeDialog,
  };
}
