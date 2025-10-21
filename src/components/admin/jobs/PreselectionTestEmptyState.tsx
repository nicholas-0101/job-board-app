"use client";
import { Plus } from "lucide-react";

interface PreselectionTestEmptyStateProps {
  addQuestion: () => void;
}

export function PreselectionTestEmptyState({ addQuestion }: PreselectionTestEmptyStateProps) {
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-slate-900 mb-2">No Test Created Yet</h3>
        <p className="text-slate-600 mb-6">Start creating your preselection test by adding questions</p>
        <button
          onClick={addQuestion}
          className="px-6 py-3 bg-[#467EC7] text-white rounded-lg hover:bg-[#578BCC] transition-colors text-sm font-medium flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          Add First Question
        </button>
      </div>
    </div>
  );
}
