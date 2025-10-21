import { useState } from "react";
import { updateInterview, deleteInterview, InterviewItemDTO } from "@/lib/interviews";

const formatForDatetimeLocal = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffsetMs = date.getTimezoneOffset() * 60_000;
  const local = new Date(date.getTime() - tzOffsetMs);
  return local.toISOString().slice(0, 16);
};

export function useInterviewEdit(companyId: number, onSuccess: () => void) {
  const [editingInterview, setEditingInterview] = useState<InterviewItemDTO | null>(null);
  const [editForm, setEditForm] = useState({
    scheduleDate: "",
    locationOrLink: "",
    notes: "",
  });
  const [updating, setUpdating] = useState(false);

  const onEdit = (interview: InterviewItemDTO) => {
    setEditingInterview(interview);
    setEditForm({
      scheduleDate: formatForDatetimeLocal(interview.scheduleDate),
      locationOrLink: interview.locationOrLink || "",
      notes: interview.notes || "",
    });
  };

  const onSaveEdit = async () => {
    if (!editingInterview) return;
    
    setUpdating(true);
    try {
      await updateInterview({
        companyId,
        id: editingInterview.id,
        scheduleDate: editForm.scheduleDate,
        locationOrLink: editForm.locationOrLink || null,
        notes: editForm.notes || null,
      });
      setEditingInterview(null);
      onSuccess(); // Refresh the list
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update interview");
    } finally {
      setUpdating(false);
    }
  };

  const onCloseModal = () => {
    setEditingInterview(null);
    setEditForm({
      scheduleDate: "",
      locationOrLink: "",
      notes: "",
    });
  };

  const onFormChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const onCancel = async (id: number) => {
    if (!confirm('Cancel this interview schedule?')) return;
    try {
      await updateInterview({ companyId, id, status: "CANCELLED" });
      onSuccess(); // Refresh the list
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to cancel interview");
    }
  };

  const onComplete = async (id: number) => {
    if (!confirm("Mark this interview as completed?")) return;
    try {
      await updateInterview({ companyId, id, status: "COMPLETED" });
      onSuccess();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to complete interview");
    }
  };

  const onRemove = async (id: number) => {
    if (!confirm("Remove this interview schedule permanently?")) return;
    try {
      await deleteInterview({ companyId, id });
      onSuccess();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to remove interview");
    }
  };

  return {
    editingInterview,
    editForm,
    updating,
    onEdit,
    onSaveEdit,
    onCloseModal,
    onFormChange,
    onCancel,
    onComplete,
    onRemove,
  };
}
