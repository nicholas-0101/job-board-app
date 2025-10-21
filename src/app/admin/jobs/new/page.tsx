"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useJobCreation } from "@/hooks/useJobCreation";
import { useErrorDialog } from "@/hooks/useErrorDialog";
import JobForm from "@/components/admin/jobs/JobForm";
import ErrorDialog from "@/components/admin/shared/ErrorDialog";

export default function NewJobPage() {
  const router = useRouter();
  const { form, submitting, error: jobError, updateForm, onSubmit, clearError: clearJobError } = useJobCreation();
  const { 
    dialogOpen, 
    dialogTitle, 
    dialogMessage, 
    dialogType, 
    closeDialog, 
    showWarning 
  } = useErrorDialog();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearJobError();
    await onSubmit(e);
  };

  const handleCancel = () => {
    router.push("/admin/jobs");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Dialog */}
      <ErrorDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        type={dialogType}
        onConfirm={closeDialog}
      />
      
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
                <h1 className="text-3xl font-bold text-gray-900">Create New Job</h1>
                <p className="text-gray-600 mt-2">Fill in the job details to create a new job posting</p>
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
          <JobForm
            form={form}
            submitting={submitting}
            error={jobError}
            onUpdateForm={updateForm}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}


