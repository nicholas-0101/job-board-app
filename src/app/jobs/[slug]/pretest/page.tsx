"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchPreselectionTest,
  submitPreselectionAnswers,
  PreselectionTestDTO,
} from "@/lib/preselection";
import { apiCall } from "@/helper/axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function JobPretestPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<PreselectionTestDTO | null>(null);
  const [jobId, setJobId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // First, fetch the job by slug to get the job ID
        const jobResponse = await apiCall.get(`/job/${slug}`);
        const fetchedJobId = jobResponse.data.data.id;
        if (mounted) setJobId(fetchedJobId);

        // Then fetch the test using the job ID
        const t = await fetchPreselectionTest(fetchedJobId);
        
        // If no test exists for this job (returns null)
        if (!t) {
          setError("This job does not have a pre-selection test");
          setLoading(false);
          return;
        }
        
        // Ensure options is always an array
        if (t.questions) {
          t.questions = t.questions.map((q: any) => {
            let processedOptions: string[] = [];
            
            if (Array.isArray(q.options)) {
              processedOptions = q.options;
            } else if (typeof q.options === 'string') {
              try {
                processedOptions = JSON.parse(q.options);
              } catch (e) {
                console.error("Failed to parse options as JSON:", e);
                processedOptions = [];
              }
            } else if (q.options && typeof q.options === 'object') {
              // Handle Prisma Json type
              processedOptions = Object.values(q.options) as string[];
            } else {
              processedOptions = [];
            }
            
            return {
              ...q,
              options: processedOptions
            };
          });
        }
        
        if (mounted) setTest(t);
      } catch (e: any) {
        console.error("Failed to load test:", e);
        setError(e?.response?.data?.message || "Failed to load test");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const canSubmit = useMemo(() => {
    if (!test) return false;
    return test.questions.every(
      (q) => typeof answers[q.id] === "string" && answers[q.id]!.length > 0
    );
  }, [test, answers]);

  const onSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const onSubmit = async () => {
    if (!test) return;
    setSubmitting(true);
    try {
      // Get user ID from localStorage
      const raw = localStorage.getItem("userId");
      const applicantId = raw ? Number(raw) : undefined;
      if (!applicantId) throw new Error("Not authenticated");

      const payload = test.questions.map((q) => ({
        questionId: q.id,
        selected: answers[q.id],
      }));
      await submitPreselectionAnswers({
        applicantId,
        testId: test.id,
        answers: payload,
      });
      alert(
        "Test submitted successfully! You can now proceed with your job application."
      );
      router.push(`/explore/jobs/${slug}`);
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-[#24CFA7]" />
        </motion.div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-lg mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#467EC7] text-white rounded-lg hover:bg-[#467EC7]/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!test)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 text-lg mb-4">No Test Available</div>
          <p className="text-gray-500">
            This job doesn't have a pre-selection test.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-[#467EC7] text-white rounded-lg hover:bg-[#467EC7]/80"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur border-b border-gray-200 sticky top-16">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#467EC7]">
                Pre-Selection Test
              </h1>
              <p className="text-gray-600">
                Complete this test to proceed with your job application
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-bold text-[#467EC7]">
                {Object.keys(answers).length} / {test.questions.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Test Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Test Information
              </h2>
              {typeof test.passingScore === "number" && (
                <div className="text-sm text-gray-600">
                  Passing Score:{" "}
                  <span className="font-semibold text-[#467EC7]">
                    {test.passingScore}
                  </span>{" "}
                  / {test.questions.length}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Total Questions:</span>{" "}
                {test.questions.length}
              </div>
              <div>
                <span className="font-medium">Answered:</span>{" "}
                {Object.keys(answers).length}
              </div>
              <div>
                <span className="font-medium">Remaining:</span>{" "}
                {test.questions.length - Object.keys(answers).length}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {test.questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                  {idx + 1}. {q.question}
                </h3>
                <div className="space-y-3">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-[#24CFA7]/60 hover:bg-[#24CFA7]/5 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => onSelect(q.id, opt)}
                        className="text-[#24CFA7] focus:ring-[#24CFA7]"
                      />
                      <span className="text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {canSubmit ? (
                  <span className="text-muted-foreground">
                    All questions answered
                  </span>
                ) : (
                  <span className="text-red-400">
                    Please answer all questions
                  </span>
                )}
              </div>
              <button
                onClick={onSubmit}
                disabled={!canSubmit || submitting}
                className="px-8 py-3 bg-[#24CFA7] text-white rounded-lg hover:bg-[#24CFA7]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">Submitting...</div>
                ) : (
                  "Submit Test"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
