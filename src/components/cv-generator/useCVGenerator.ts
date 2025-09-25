import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { apiCall } from "@/helper/axios";
import { CVFormData, CVTemplate, GeneratedCV } from "./types";

export function useCVGenerator() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [generatedCVs, setGeneratedCVs] = useState<GeneratedCV[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"generate" | "my-cvs">("generate");
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<CVFormData>({
    templateId: "ats",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    languages: "",
    certifications: "",
    linkedin: "",
    portfolio: "",
  });

  // Check authentication first
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  // Load templates and user's CVs only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      checkSubscriptionAndLoadData();
    } else if (isAuthenticated === false) {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const checkSubscriptionAndLoadData = async () => {
    try {
      const subscriptionResponse = await apiCall.get(
        "/subscription/my-active-subscription"
      );

      if (subscriptionResponse.data && subscriptionResponse.data.isActive) {
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

  const loadTemplates = async () => {
    try {
      const response = await apiCall.get("/cv/templates");
      setTemplates(response.data.templates || []);
    } catch (error: any) {
      console.error("Error loading templates:", error);
      toast.error("Failed to load CV templates");
    }
  };

  const loadUserCVs = async () => {
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

  const handleInputChange = (field: keyof CVFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateCV = async () => {
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in required fields (Full Name, Email)");
      return;
    }

    setIsGenerating(true);
    try {
      const backendData = {
        templateType: formData.templateId,
        additionalInfo: {
          objective: formData.summary || undefined,
          skills: formData.skills
            ? formData.skills.split(",").map((s) => s.trim())
            : undefined,
          linkedin: formData.linkedin || undefined,
          portfolio: formData.portfolio || undefined,
          workExperience: formData.experience
            ? [
                {
                  company: "Various",
                  responsibilities: formData.experience
                    .split("\n")
                    .filter((line) => line.trim()),
                },
              ]
            : undefined,
          educationDetails: formData.education
            ? [
                {
                  institution: formData.education,
                  degree: "Degree",
                  year: new Date().getFullYear().toString(),
                },
              ]
            : undefined,
          languages: formData.languages
            ? formData.languages.split(",").map((lang) => ({
                name: lang.trim(),
                level: "Intermediate",
              }))
            : undefined,
          certifications: formData.certifications
            ? formData.certifications.split(",").map((cert) => ({
                name: cert.trim(),
                issuer: "Various",
                date: new Date().getFullYear().toString(),
              }))
            : undefined,
        },
      };

      await apiCall.post("/cv/generate", backendData);
      toast.success("CV generated successfully!");

      // Reset form
      setFormData({
        templateId: "ats",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        summary: "",
        experience: "",
        education: "",
        skills: "",
        languages: "",
        certifications: "",
        linkedin: "",
        portfolio: "",
      });

      loadUserCVs();
      setActiveTab("my-cvs");
    } catch (error: any) {
      console.error("Error generating CV:", error);
      if (error.response?.status === 401) {
        toast.error("Please sign in to generate CVs");
      } else if (error.response?.status === 403) {
        const message = error.response?.data?.message;
        if (message?.includes("subscription")) {
          toast.error("Active subscription required to generate CVs");
        } else if (message?.includes("limit")) {
          toast.error("CV generation limit reached for your subscription plan");
        } else if (message?.includes("template")) {
          toast.error(
            "Selected template not available in your subscription plan"
          );
        } else {
          toast.error(
            "Access denied: " + (message || "Insufficient permissions")
          );
        }
      } else {
        const errorMessage =
          error.response?.data?.message || "Failed to generate CV";
        toast.error(errorMessage);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadCV = async (cvId: string, fileName: string) => {
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

  const handleDeleteCV = async (cvId: string) => {
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

  return {
    // State
    templates,
    generatedCVs,
    isGenerating,
    isLoading,
    activeTab,
    hasSubscription,
    isAuthenticated,
    formData,
    
    // Actions
    setActiveTab,
    handleInputChange,
    handleGenerateCV,
    handleDownloadCV,
    handleDeleteCV,
    checkSubscriptionAndLoadData,
  };
}
