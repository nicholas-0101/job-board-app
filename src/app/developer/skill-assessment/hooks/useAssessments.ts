import { useState, useEffect } from "react";
import { getDeveloperAssessments, deleteAssessment } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

export interface AssessmentData {
  id: number;
  title: string;
  description?: string;
  category?: string;
  questionCount: number;
  attemptCount: number;
  passRate: number;
  createdAt: string;
  badgeTemplateId?: number;
  _count?: {
    questions: number;
    results: number;
  };
}

export const useAssessments = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeveloperAssessments();
      
      // Backend sends: { success: true, data: { assessments: [...], pagination: {...} } }
      const assessmentsData = response.data?.assessments || response.assessments || [];
      const data = Array.isArray(assessmentsData) ? assessmentsData : [];
      
      // Map backend data to frontend format
      const mappedData = data.map((item: any) => ({
        ...item,
        questionCount: item._count?.questions || 0,
        attemptCount: item._count?.results || 0,
        passRate: 0, // Will be calculated from results if needed
        category: item.badgeTemplate?.category || "General",
      }));
      
      setAssessments(mappedData);
    } catch (err: any) {
      console.error("Error fetching assessments:", err);
      setError(err.response?.data?.message || "Failed to load assessments");
      toast.error("Failed to load assessments");
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (assessmentId: number) => {
    if (!confirm("Are you sure you want to delete this assessment?")) {
      return;
    }

    try {
      await deleteAssessment(assessmentId);
      toast.success("Assessment deleted successfully");
      // Remove from local state
      setAssessments((prev) => prev.filter((a) => a.id !== assessmentId));
    } catch (err: any) {
      console.error("Error deleting assessment:", err);
      toast.error(err.response?.data?.message || "Failed to delete assessment");
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  return {
    assessments,
    loading,
    error,
    refetch: fetchAssessments,
    deleteAssessment: handleDeleteAssessment,
  };
};
