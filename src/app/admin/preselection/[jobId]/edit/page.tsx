"use client";
import { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { usePreselectionTest } from "@/hooks/usePreselectionTest";
import PreselectionTest from "@/components/admin/jobs/PreselectionTest";

export default function EditPreselectionTestPage({ params }: { params: Promise<{ jobId: string }> }) {
  const resolvedParams = use(params);
  const jobId = parseInt(resolvedParams.jobId);
  const preselectionTest = usePreselectionTest(jobId, true);

  if (!preselectionTest.testLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/preselection">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Preselection Test</h1>
                <p className="text-gray-600 mt-2">Manage preselection test questions and settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/preselection">
                <button className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                  Back to Tests
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <PreselectionTest {...preselectionTest} />
        </div>
      </div>
    </div>
  );
}
