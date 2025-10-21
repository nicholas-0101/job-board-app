"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useJobEditing } from "@/hooks/useJobEditing";
import JobEditForm from "@/components/admin/jobs/JobEditForm";

export default function EditJobPage() {
  const { 
    jobId,
    form, 
    loading, 
    saving, 
    saveError, 
    updateForm, 
    onSave, 
    onDelete 
  } = useJobEditing();

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
        <p className="text-gray-600">Loading job details...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/jobs">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Job Posting</h1>
                <p className="text-gray-600 mt-2">Update job details and manage applicants</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/jobs">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Back to Jobs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <JobEditForm
            form={form}
            saving={saving}
            saveError={saveError}
            onUpdateForm={updateForm}
            onSave={onSave}
            onDelete={onDelete}
          />
        </div>
      </div>
    </div>
  );
}


