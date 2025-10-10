"use client";
import { useEffect, useState } from "react";
import { updateJob, deleteJob, getJobDetail } from "@/lib/jobs";
import { upsertPreselectionTest, fetchPreselectionTest } from "@/lib/preselection";
import { apiCall } from "@/helper/axios";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { TestTube, Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const searchParams = useSearchParams();
  const jobId = Number(params.jobId);
  const [companyId, setCompanyId] = useState<number>(() => {
    const raw = localStorage.getItem("companyId");
    return raw ? Number(raw) : NaN;
  });
  const [form, setForm] = useState<any>({ title: "", category: "", description: "", city: "", salaryMin: null, salaryMax: null, tags: [], deadline: null });
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
  const [testLoaded, setTestLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // Resolve companyId from backend if missing/stale
        let cid = companyId;
        if (!cid || Number.isNaN(cid)) {
          try {
            const resp = await apiCall.get("/company/admin");
            const data = resp.data?.data ?? resp.data;
            const resolved = Number(data?.id ?? data?.data?.id);
            if (resolved) {
              cid = resolved;
              localStorage.setItem("companyId", cid.toString());
              setCompanyId(cid);
            }
          } catch {}
        }

        if (!cid || Number.isNaN(cid)) throw new Error("Company not found");

        const detail = await getJobDetail({ companyId: cid, jobId });
        setForm({
          title: detail.title || "",
          category: detail.category || "",
          description: (detail as any).description || "",
          city: detail.city || "",
          salaryMin: detail.salaryMin ?? null,
          salaryMax: detail.salaryMax ?? null,
          tags: detail.tags ?? [],
          deadline: (detail as any).deadline ?? null,
        });

        // Activate test tab from query if provided
        const tab = searchParams?.get("tab");
        if (tab === "test") setActiveTab("test");

        // Load existing preselection test for this job (if any)
        try {
          const test = await fetchPreselectionTest(jobId);
          // test will be null if no test exists (404)
          if (test) {
            setIsTestActive(!!test.isActive);
            setPassingScore(test.passingScore ?? 0);
            const mapped = (test.questions || []).map((q: any) => ({
              question: q.question || "",
              options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
              answer: (q as any).answer || "",
            }));
            setTestQuestions(mapped);
          }
        } catch (error) {
          // Silently ignore - no test exists
        }
        setTestLoaded(true);
      } catch (e) {
        // noop
      } finally {
        setLoading(false);
      }
    })();
  }, [companyId, jobId]);

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
    if (testQuestions.length >= 25) return;
    setTestQuestions([...testQuestions, { question: "", options: ["", "", "", ""], answer: "" }]);
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
    if (!isTestActive) {
      await upsertPreselectionTest({ jobId, isActive: false, passingScore: 0, questions: [] });
      alert("Preselection test disabled for this job.");
      return;
    }
    if (testQuestions.length !== 25) {
      alert("Pre-selection test must contain exactly 25 questions");
      return;
    }
    for (let i = 0; i < testQuestions.length; i++) {
      const q = testQuestions[i];
      if (!q.question.trim()) return alert(`Question ${i + 1} is empty`);
      if (!Array.isArray(q.options) || q.options.length !== 4)
        return alert(`Question ${i + 1} must have 4 options`);
      if (q.options.some((opt) => !opt.trim()))
        return alert(`All options must be filled for question ${i + 1}`);
      if (!q.answer.trim() || !q.options.includes(q.answer))
        return alert(`Answer for question ${i + 1} must match one of the options`);
    }

    try {
      await apiCall.post(`/preselection/jobs/${jobId}/tests`, {
        questions: testQuestions,
        passingScore,
        isActive: isTestActive,
      });
      alert("Pre-selection test saved successfully!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save test");
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
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <input
                    placeholder="e.g. Engineering"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  placeholder="Describe the job responsibilities and requirements..."
                  value={form.description}
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
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (IDR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 15000000"
                    value={form.salaryMin ?? ""}
                    onChange={(e) => setForm({ ...form, salaryMin: Number(e.target.value) || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (IDR)</label>
                  <input
                    type="number"
                    placeholder="e.g. 25000000"
                    value={form.salaryMax ?? ""}
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
                    value={(form.tags || []).join(', ')}
                    onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                  <input
                    type="date"
                    value={form.deadline || ""}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value || null })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : "Save Job"}
                </Button>
                <Button type="button" onClick={onDelete} variant="outline" className="gap-2 text-red-600 border-red-300 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  Delete Job
                </Button>
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
                    Enable Preselection Test
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <label className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={isTestActive} onChange={(e)=>setIsTestActive(e.target.checked)} />
                    Enable Preselection Test
                  </label>
                  <p className="text-sm text-gray-600">Questions: {testQuestions.length}/25</p>
                  {testLoaded ? (
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">{testQuestions.length ? 'Loaded from server' : 'No test yet'}</span>
                  ) : (
                    <span className="text-xs text-gray-500">Loading test…</span>
                  )}
                </div>
                <Button onClick={addQuestion} className="gap-2 bg-[#24CFA7] hover:bg-[#1fc39c]" disabled={!isTestActive || testQuestions.length>=25}>
                  <Plus className="w-4 h-4" />
                  Add Question
                </Button>
              </div>

              {isTestActive && testQuestions.length > 0 && (
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

              {isTestActive && testQuestions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No questions added yet. Click "Add Question" to start creating the test.</p>
                </div>
              )}
              {!isTestActive && (
                <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-4">
                  This job currently does not require a preselection test. Toggle "Enable Preselection Test" to create one.
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={async () => {
                  try {
                    await saveTest();
                  } catch (err: any) {
                    alert(err?.response?.data?.message || "Failed to save test");
                  }
                }}
                className="gap-2 bg-[#467EC7] hover:bg-[#578BCC]"
              >
                <Save className="w-4 h-4" />
                Save Test
              </Button>
              <Link href="/admin/preselection" className="ml-2 inline-flex items-center text-sm text-blue-600 hover:underline">Manage all tests</Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}


