"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useJobEditing } from "@/hooks/useJobEditing";
import { usePreselectionTest } from "@/hooks/usePreselectionTest";
import TabNavigation from "@/components/admin/jobs/TabNavigation";
import JobEditForm from "@/components/admin/jobs/JobEditForm";
import PreselectionTest from "@/components/admin/jobs/PreselectionTest";

export default function EditJobPage() {
  const { 
    jobId,
    form, 
    loading, 
    saving, 
    saveError, 
    activeTab, 
    setActiveTab, 
    updateForm, 
    onSave, 
    onDelete 
  } = useJobEditing();

  const preselectionTest = usePreselectionTest(jobId);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Job Posting</h1>
                <p className="text-gray-600">Manage job details and pre-selection test</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Job Details Tab */}
        {activeTab === "job" && (
          <JobEditForm
            form={form}
            saving={saving}
            saveError={saveError}
            onUpdateForm={updateForm}
            onSave={onSave}
            onDelete={onDelete}
          />
        )}

        {/* Pre-Selection Test Tab */}
        {activeTab === "test" && (
          <PreselectionTest {...preselectionTest} />
        )}
      </div>
    </div>
  );
}


