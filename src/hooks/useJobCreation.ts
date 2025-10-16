import { useState } from "react";
import { createJob } from "@/lib/jobs";
import { useRouter } from "next/navigation";
import { useCompanyId } from "@/hooks/useCompanyId";
import { apiCall } from "@/helper/axios";

interface JobFormData {
  title: string;
  description: string;
  category: string;
  city: string;
  salaryMin: string;
  salaryMax: string;
  tags: string;
  deadline: string;
}

interface TestData {
  questions: Array<{
    question: string;
    options: string[];
    answer: string;
  }>;
  passingScore: number;
  isActive: boolean;
}

export function useJobCreation() {
  const router = useRouter();
  const { companyId, fetchCompanyId } = useCompanyId();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<JobFormData>({
    title: "",
    description: "",
    category: "",
    city: "",
    salaryMin: "",
    salaryMax: "",
    tags: "",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });

  const updateForm = (field: keyof JobFormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent, testData?: TestData) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let resolvedCompanyId = companyId;
      if (!resolvedCompanyId || Number.isNaN(resolvedCompanyId)) {
        resolvedCompanyId = await fetchCompanyId();
      }
      if (!resolvedCompanyId || Number.isNaN(resolvedCompanyId)) {
        throw new Error("Company ID not found. Please ensure you are logged in as an admin.");
      }

      // Validate deadline is in the future
      if (form.deadline && new Date(form.deadline) <= new Date()) {
        setError("Deadline must be in the future");
        setSubmitting(false);
        return;
      }

      // Create the job first
      const job = await createJob({
        companyId: resolvedCompanyId,
        title: form.title,
        description: form.description,
        category: form.category,
        city: form.city,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        deadline: form.deadline || null,
      });

      // If test data is provided, create the preselection test
      if (testData && testData.isActive && testData.questions.length > 0) {
        try {
          await apiCall.post(`/preselection/jobs/${job.id}/tests`, {
            questions: testData.questions,
            passingScore: testData.passingScore,
            isActive: testData.isActive,
          });
        } catch (testError: any) {
          console.error("Failed to create preselection test:", testError);
          setError("Job created successfully, but failed to create preselection test: " + (testError?.response?.data?.message || "Unknown error"));
          setSubmitting(false);
          return;
        }
      }

      router.push("/admin/jobs");
    } catch (e: any) {
      console.error("Job creation error:", e);
      setError(e?.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    form,
    submitting,
    error,
    updateForm,
    onSubmit,
    clearError: () => setError(null),
  };
}
