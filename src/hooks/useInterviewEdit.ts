import { useState } from "react";
import { updateInterview, InterviewItemDTO } from "@/lib/interviews";

export function useInterviewEdit(companyId: number, onSuccess: () => void) {
  const [editingInterview, setEditingInterview] = useState<InterviewItemDTO | null>(null);
  const [editForm, setEditForm] = useState({
    scheduleDate: "",
    locationOrLink: "",
    notes: "",
    status: "SCHEDULED" as "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
  });
  const [updating, setUpdating] = useState(false);

  const onEdit = (interview: InterviewItemDTO) => {
    setEditingInterview(interview);
    const dateStr = new Date(interview.scheduleDate).toISOString().slice(0, 16);
    setEditForm({
      scheduleDate: dateStr,
      locationOrLink: interview.locationOrLink || "",
      notes: interview.notes || "",
      status: interview.status
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
        status: editForm.status
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
      status: "SCHEDULED"
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

  return {
    editingInterview,
    editForm,
    updating,
    onEdit,
    onSaveEdit,
    onCloseModal,
    onFormChange,
    onCancel,
  };
}
