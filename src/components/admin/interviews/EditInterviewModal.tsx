"use client";

interface InterviewItemDTO {
  id: number;
  applicationId: number;
  scheduleDate: string;
  locationOrLink?: string | null;
  notes?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  candidateName: string;
  jobTitle: string;
}

interface EditInterviewModalProps {
  editingInterview: InterviewItemDTO | null;
  editForm: {
    scheduleDate: string;
    locationOrLink: string;
    notes: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  };
  updating: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (field: string, value: string) => void;
}

export default function EditInterviewModal({
  editingInterview,
  editForm,
  updating,
  onClose,
  onSave,
  onFormChange,
}: EditInterviewModalProps) {
  if (!editingInterview) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Interview - {editingInterview.candidateName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                value={editForm.scheduleDate}
                onChange={(e) => onFormChange('scheduleDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#24CFA7] focus:border-[#24CFA7] bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location/Link
              </label>
              <input
                type="text"
                value={editForm.locationOrLink}
                onChange={(e) => onFormChange('locationOrLink', e.target.value)}
                placeholder="Office address, Google Meet link, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#24CFA7] focus:border-[#24CFA7] bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={editForm.notes}
                onChange={(e) => onFormChange('notes', e.target.value)}
                placeholder="Additional notes for the interview..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#24CFA7] focus:border-[#24CFA7] bg-background resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={editForm.status}
                onChange={(e) => onFormChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#24CFA7] focus:border-[#24CFA7] bg-background"
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="NO_SHOW">No Show</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={updating}
              className="flex-1 px-4 py-2 bg-[#24CFA7] hover:bg-[#1fc39c] text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17,21 17,13 7,13 7,21"/>
                    <polyline points="7,3 7,8 15,8"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
