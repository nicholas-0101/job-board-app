import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CVFormData, CVTemplate, GeneratedCV } from "./types";
import { DEFAULT_FORM_DATA } from "./constants";
import { 
  checkSubscriptionAndLoadData as checkSubscription,
  loadTemplates as loadTemplatesAPI,
  loadUserCVs as loadUserCVsAPI,
  handleDownloadCV as downloadCV,
  handleDeleteCV as deleteCV
} from "./cvOperations";
import { handleGenerateCV as generateCV } from "./cvGeneration";

export function useCVGenerator() {
  const router = useRouter();
  const [templates, setTemplates] = useState<CVTemplate[]>([]);
  const [generatedCVs, setGeneratedCVs] = useState<GeneratedCV[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"generate" | "my-cvs">("generate");
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [formData, setFormData] = useState<CVFormData>(DEFAULT_FORM_DATA);

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

  const checkSubscriptionAndLoadData = () => 
    checkSubscription(setHasSubscription, setIsLoading, loadTemplates, loadUserCVs);

  const loadTemplates = () => loadTemplatesAPI(setTemplates);

  const loadUserCVs = () => loadUserCVsAPI(setGeneratedCVs, setIsLoading);

  const handleInputChange = (field: keyof CVFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateCV = () => 
    generateCV(formData, setIsGenerating, setFormData, loadUserCVs, setActiveTab);

  const handleDownloadCV = (cvId: string, fileName: string) => 
    downloadCV(cvId, fileName);

  const handleDeleteCV = (cvId: string) => 
    deleteCV(cvId, loadUserCVs);

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
