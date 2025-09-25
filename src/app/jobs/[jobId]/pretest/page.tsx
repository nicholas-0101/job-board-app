"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchPreselectionTest, submitPreselectionAnswers, PreselectionTestDTO } from "@/lib/preselection";

export default function JobPretestPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const jobId = Number(params.jobId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [test, setTest] = useState<PreselectionTestDTO | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await fetchPreselectionTest(jobId);
        if (mounted) setTest(t);
      } catch (e: any) {
        setError(e?.response?.data?.message || "Failed to load test");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [jobId]);

  const canSubmit = useMemo(() => {
    if (!test) return false;
    return test.questions.every((q) => typeof answers[q.id] === "string" && answers[q.id]!.length > 0);
  }, [test, answers]);

  const onSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const onSubmit = async () => {
    if (!test) return;
    setSubmitting(true);
    try {
      // NOTE: assuming userId is stored in localStorage decoded elsewhere; for now, require token-only flow
      const raw = localStorage.getItem("userId");
      const applicantId = raw ? Number(raw) : undefined;
      if (!applicantId) throw new Error("Not authenticated");

      const payload = test.questions.map((q) => ({ questionId: q.id, selected: answers[q.id] }));
      await submitPreselectionAnswers({ applicantId, testId: test.id, answers: payload });
      alert("Test submitted successfully");
      router.back();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Loading preselection test...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!test) return <div className="p-6">No test available.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Preselection Test</h1>
        {typeof test.passingScore === "number" && (
          <p className="text-sm text-gray-500">Passing score: {test.passingScore} / {test.questions.length}</p>
        )}
      </div>

      {test.questions.map((q, idx) => (
        <div key={q.id} className="bg-white border rounded-xl p-4 space-y-3">
          <div className="font-medium">{idx + 1}. {q.question}</div>
          <div className="grid gap-2">
            {q.options.map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${q.id}`}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => onSelect(q.id, opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          disabled={!canSubmit || submitting}
          onClick={onSubmit}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>
      </div>
    </div>
  );
}


