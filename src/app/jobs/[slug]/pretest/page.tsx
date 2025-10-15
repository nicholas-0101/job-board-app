"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  fetchPreselectionTest,
  submitPreselectionAnswers,
  getMyPreselectionStatus,
  PreselectionTestDTO,
} from "@/lib/preselection";
import { apiCall } from "@/helper/axios";
import { LoadingSpinner } from "@/components/preselection/LoadingSpinner";
import { ErrorDisplay } from "@/components/preselection/ErrorDisplay";
import { NoTestAvailable } from "@/components/preselection/NoTestAvailable";
import { TestHeader } from "@/components/preselection/TestHeader";
import { TestInfo } from "@/components/preselection/TestInfo";
import { QuestionsList } from "@/components/preselection/QuestionsList";
import { SubmitSection } from "@/components/preselection/SubmitSection";

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
  const [testAlreadyCompleted, setTestAlreadyCompleted] = useState(false);
  const [testResult, setTestResult] = useState<{
    score: number | null;
    passingScore: number | null;
    isPassed: boolean;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // First, fetch the job by slug to get the job ID
        const jobResponse = await apiCall.get(`/job/${slug}`);
        const fetchedJobId = jobResponse.data.data.id;
        if (mounted) setJobId(fetchedJobId);

        // Check if user has already completed the test
        try {
          const status = await getMyPreselectionStatus(fetchedJobId);
          if (status.submitted) {
            setTestAlreadyCompleted(true);
            setTestResult({
              score: status.score ?? null,
              passingScore: status.passingScore ?? null,
              isPassed: status.isPassed || false,
            });
            if (mounted) setLoading(false);
            return;
          }
        } catch (statusError: any) {
          // If status check fails (e.g., not authenticated), continue with normal flow
          console.log("Status check failed, continuing with test:", statusError);
        }

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

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!test) return <NoTestAvailable />;

  // Show test completion message if user has already completed the test
  if (testAlreadyCompleted && testResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className={`inline-flex items-center px-6 py-3 rounded-lg text-lg font-medium mb-4 ${
            testResult.isPassed 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {testResult.isPassed ? '✓ Passed' : '✗ Failed'} {testResult.score}/{testResult.passingScore}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Test Already Completed
          </h2>
          <p className="text-gray-600 mb-6">
            You have already completed this pre-selection test. You cannot retake it.
          </p>
          <button
            onClick={() => router.push(`/explore/jobs/${slug}`)}
            className="px-6 py-2 bg-[#467EC7] text-white rounded-lg hover:bg-[#467EC7]/80 transition-colors"
          >
            Back to Job Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TestHeader test={test} answers={answers} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <TestInfo test={test} answers={answers} />
          <QuestionsList test={test} answers={answers} onSelect={onSelect} />
          <SubmitSection test={test} answers={answers} submitting={submitting} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
