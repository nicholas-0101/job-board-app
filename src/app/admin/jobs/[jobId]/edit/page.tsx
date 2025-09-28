"use client";
import { useEffect, useState } from "react";
import { updateJob, listCompanyJobs, deleteJob } from "@/lib/jobs";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { TestTube, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const jobId = Number(params.jobId);
  const [companyId] = useState<number>(() => Number(localStorage.getItem("companyId") || 16));
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("job");
  const [testQuestions, setTestQuestions] = useState<Array<{
    question: string;
    options: string[];
    answer: string;
  }>>([]);
  const [passingScore, setPassingScore] = useState(20);
  const [isTestActive, setIsTestActive] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await listCompanyJobs({ companyId, limit: 1, offset: 0, title: "" });
        // In absence of a direct detail endpoint on frontend lib, rely on admin jobs table then fetch detail page from backend if available later
        // Keep simple: allow editing fields manually
        setForm((f: any) => ({ ...f }));
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateJob({ companyId, jobId, ...form });
      router.push("/admin/jobs");
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update job");
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

  const addQuestion = () => {
    setTestQuestions([...testQuestions, {
      question: "",
      options: ["", "", "", ""],
      answer: ""
    }]);
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...testQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setTestQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    setTestQuestions(testQuestions.filter((_, i) => i !== index));
  };

  const saveTest = async () => {
    if (testQuestions.length < 25) {
      alert("Please add exactly 25 questions for the pre-selection test");
      return;
    }

    // Validate all questions
    for (let i = 0; i < testQuestions.length; i++) {
      const q = testQuestions[i];
      if (!q.question.trim() || q.options.some(opt => !opt.trim()) || !q.answer.trim()) {
        alert(`Please complete question ${i + 1}`);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4400/preselection/jobs/${jobId}/tests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          questions: testQuestions,
          passingScore,
          isActive: isTestActive
        })
      });

      if (response.ok) {
        alert("Pre-selection test saved successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to save test");
      }
    } catch (error) {
      alert("Failed to save test");
    }
  };

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
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("job")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "job"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Job Details
            </button>
            <button
              onClick={() => setActiveTab("test")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "test"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <TestTube className="w-4 h-4 inline mr-2" />
              Pre-Selection Test
            </button>
          </div>
        </div>

        {/* Job Details Tab */}
        {activeTab === "job" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Information</h2>
            <form onSubmit={onSave} className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    placeholder="e.g. Senior Frontend Developer"
                    defaultValue={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    placeholder="e.g. Engineering"
                    defaultValue={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe the job responsibilities and requirements..."
                  defaultValue={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    placeholder="e.g. Jakarta"
                    defaultValue={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (IDR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000000"
                    defaultValue={form.salaryMin}
                    onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (IDR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000000"
                    defaultValue={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    placeholder="e.g. React, TypeScript, Node.js"
                    defaultValue={(form.tags || []).join(', ')}
                    onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    defaultValue={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <motion.button
                  type="submit"
                  disabled={saving}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Job"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={onDelete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Job
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Pre-Selection Test Tab */}
        {activeTab === "test" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pre-Selection Test</h2>
                <p className="text-gray-600">Create 25 multiple choice questions for job applicants</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">Passing Score:</label>
                  <input
                    type="number"
                    min="1"
                    max="25"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center"
                  />
                  <span className="text-sm text-gray-500">/ 25</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testActive"
                    checked={isTestActive}
                    onChange={(e) => setIsTestActive(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="testActive" className="text-sm font-medium text-gray-700">
                    Activate Test
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">
                  Questions: {testQuestions.length}/25
                </p>
                <motion.button
                  onClick={addQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </motion.button>
              </div>

              {testQuestions.length > 0 && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {testQuestions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                        <button
                          onClick={() => removeQuestion(index)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                          <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(index, "question", e.target.value)}
                            placeholder="Enter the question..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Option {String.fromCharCode(65 + optIndex)}
                              </label>
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...question.options];
                                  newOptions[optIndex] = e.target.value;
                                  updateQuestion(index, "options", newOptions);
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          ))}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                          <select
                            value={question.answer}
                            onChange={(e) => updateQuestion(index, "answer", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select correct answer</option>
                            {question.options.map((option, optIndex) => (
                              <option key={optIndex} value={option}>
                                {String.fromCharCode(65 + optIndex)}: {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {testQuestions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No questions added yet. Click "Add Question" to start creating the test.</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <motion.button
                onClick={saveTest}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Test
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


