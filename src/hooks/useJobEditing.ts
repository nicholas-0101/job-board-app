import { useState, useEffect } from "react";
import { updateJob, deleteJob, getJobDetail } from "@/lib/jobs";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useCompanyId } from "@/hooks/useCompanyId";

interface JobFormData {
  title: string;
  category: string;
  description: string;
  city: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: number | null;
  salaryMax: number | null;
  tags: string[];
  deadline: string | null;
}

export function useJobEditing() {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();
  const jobId = Number(params.jobId);
  const { companyId, fetchCompanyId } = useCompanyId();

  const [form, setForm] = useState<JobFormData>({
    title: "",
    category: "",
    description: "",
    city: "",
    employmentType: "",
    experienceLevel: "",
    salaryMin: null,
    salaryMax: null,
    tags: [],
    deadline: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("job");

  useEffect(() => {
    (async () => {
      try {
        let cid = companyId;
        if (!cid || Number.isNaN(cid)) {
          cid = await fetchCompanyId();
        }

        if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

        const detail = await getJobDetail({ companyId: cid, jobId });
        setForm({
          title: detail.title || "",
          category: detail.category || "",
          description: (detail as any).description || "",
          city: detail.city || "",
          employmentType: (detail as any).employmentType || "",
          experienceLevel: (detail as any).experienceLevel || "",
          salaryMin: detail.salaryMin ?? null,
          salaryMax: detail.salaryMax ?? null,
          tags: detail.tags ?? [],
          deadline: (detail as any).deadline ?? null,
        });

        // Activate test tab from query if provided
        const tab = searchParams?.get("tab");
        if (tab === "test") setActiveTab("test");
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, jobId]);

  const updateForm = (field: keyof JobFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      const cleanedForm = {
        ...form,
        employmentType: form.employmentType || null,
        experienceLevel: form.experienceLevel || null,
        salaryMin: form.salaryMin || null,
        salaryMax: form.salaryMax || null,
        deadline: form.deadline || null,
      };
      await updateJob({ companyId, jobId, ...cleanedForm });
      router.push("/admin/jobs");
    } catch (e: any) {
      setSaveError(e?.response?.data?.message || "Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob({ companyId, jobId });
      router.push("/admin/jobs");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to delete job");
    }
  };

  return {
    jobId,
    form,
    loading,
    saving,
    saveError,
    activeTab,
    setActiveTab,
    updateForm,
    onSave,
    onDelete,
  };
}
