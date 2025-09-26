import toast from "react-hot-toast";
import { apiCall } from "@/helper/axios";
import { CVFormData } from "./types";
import { DEFAULT_FORM_DATA } from "./constants";

export const handleGenerateCV = async (
  formData: CVFormData,
  setIsGenerating: (value: boolean) => void,
  setFormData: (data: CVFormData) => void,
  loadUserCVs: () => Promise<void>,
  setActiveTab: (tab: "generate" | "my-cvs") => void
) => {
  if (!formData.fullName || !formData.email) {
    toast.error("Please fill in required fields (Full Name, Email)");
    return;
  }

  setIsGenerating(true);
  try {
    const backendData = {
      templateType: formData.templateType,
      additionalInfo: {
        objective: formData.objective || undefined,
        linkedin: formData.linkedin || undefined,
        portfolio: formData.portfolio || undefined,
        projects: formData.projects.filter(p => p.name.trim()).map(p => ({
          ...p,
          technologies: Array.isArray(p.technologies) ? p.technologies : p.technologies.split(',').map(t => t.trim()).filter(t => t)
        })) || undefined,
        workExperience: formData.workExperience.filter(w => w.company.trim()) || undefined,
        educationDetails: formData.educationDetails.filter(e => e.institution.trim()) || undefined,
        certifications: formData.certifications.filter(c => c.name.trim()) || undefined,
        skills: Array.isArray(formData.skills) ? formData.skills.filter(s => s.trim()) : formData.skills.split(',').map(s => s.trim()).filter(s => s) || undefined,
        skillCategories: formData.skillCategories || undefined,
        languages: formData.languages.filter(l => l.name.trim()) || undefined,
      },
    };

    await apiCall.post("/cv/generate", backendData);
    toast.success("CV generated successfully!");

    // Reset form
    setFormData(DEFAULT_FORM_DATA);

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
