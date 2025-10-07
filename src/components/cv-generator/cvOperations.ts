import toast from "react-hot-toast";
import { apiCall } from "@/helper/axios";
import { CVFormData, CVTemplate, GeneratedCV } from "./types";

export const checkSubscriptionAndLoadData = async (
  setHasSubscription: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  loadTemplates: () => Promise<void>,
  loadUserCVs: () => Promise<void>
) => {
  try {
    const subscriptionResponse = await apiCall.get(
      "/subscription/my-active-subscription"
    );

    // Check if response has isActive property (new format) or subscription data directly (current format)
    const hasActiveSubscription = 
      (subscriptionResponse.data && subscriptionResponse.data.isActive) || // New format
      (subscriptionResponse.data && 
       subscriptionResponse.data.status === 'ACTIVE' && 
       subscriptionResponse.data.expiresAt && 
       new Date(subscriptionResponse.data.expiresAt) > new Date()); // Current format with expiry check

    if (hasActiveSubscription) {
      setHasSubscription(true);
      loadTemplates();
      loadUserCVs();
    } else {
      setHasSubscription(false);
      setIsLoading(false);
    }
  } catch (error: any) {
    console.error("Subscription check error:", error);
    if (error.response?.status === 404) {
      setHasSubscription(false);
      setIsLoading(false);
    } else {
      setHasSubscription(false);
      setIsLoading(false);
    }
  }
};

export const loadTemplates = async (
  setTemplates: (templates: CVTemplate[]) => void
) => {
  try {
    const response = await apiCall.get("/cv/templates");
    setTemplates(response.data.templates || []);
  } catch (error: any) {
    console.error("Error loading templates:", error);
    toast.error("Failed to load CV templates");
  }
};

export const loadUserCVs = async (
  setGeneratedCVs: (cvs: GeneratedCV[]) => void,
  setIsLoading: (value: boolean) => void
) => {
  try {
    const response = await apiCall.get("/cv");
    const cvs = response.data.data || response.data.cvs || response.data || [];
    setGeneratedCVs(cvs);
  } catch (error: any) {
    console.error("Error loading CVs:", error);
    toast.error("Failed to load your CVs");
  } finally {
    setIsLoading(false);
  }
};

export const handleDownloadCV = async (cvId: string, fileName: string) => {
  try {
    const response = await apiCall.get(`/cv/${cvId}/download`, {
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast.success("CV downloaded successfully!");
  } catch (error: any) {
    console.error("Error downloading CV:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to download CV";
    toast.error(errorMessage);
  }
};

export const handleDeleteCV = async (
  cvId: string,
  loadUserCVs: () => Promise<void>
) => {
  if (!confirm("Are you sure you want to delete this CV?")) return;

  try {
    await apiCall.delete(`/cv/${cvId}`);
    toast.success("CV deleted successfully!");
    loadUserCVs();
  } catch (error: any) {
    console.error("Error deleting CV:", error);
    const errorMessage =
      error.response?.data?.message || "Failed to delete CV";
    toast.error(errorMessage);
  }
};
