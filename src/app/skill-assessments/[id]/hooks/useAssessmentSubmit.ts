import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { submitAssessment } from "@/lib/skillAssessment";
import toast from "react-hot-toast";

type Question = { id: number };

export function useAssessmentSubmit(params: {
  assessment: { id: number; slug?: string; questions: Question[] } | null;
  answers: Record<number, string>;
  startTime: Date | null;
  originalStartTime: string | null;
  isSubmitted: boolean;
  submitting: boolean;
  clearProgress: () => void;
  setSubmitting: (v: boolean) => void;
  setIsSubmitted: (v: boolean) => void;
}) {
  const router = useRouter();

  const submitAssessmentData = useCallback(
    async (isAutoSubmit = false) => {
      const {
        assessment,
        answers,
        startTime,
        originalStartTime,
        isSubmitted,
        submitting,
        clearProgress,
        setSubmitting,
        setIsSubmitted,
      } = params;

      if (isSubmitted || submitting || !assessment || !startTime) return;

      const answeredCount = Object.keys(answers).length;
      if (!isAutoSubmit && answeredCount === 0) {
        toast.error("Please answer at least one question before submitting");
        return;
      }

      try {
        setSubmitting(true);
        setIsSubmitted(true);
        clearProgress();

        const formattedAnswers = assessment.questions
          .map((q) => ({ questionId: q.id, answer: answers[q.id] || "" }))
          .filter((a) => a.answer !== "");

        const response = await submitAssessment({
          assessmentId: assessment.id,
          answers: formattedAnswers,
          startedAt: originalStartTime || startTime.toISOString(),
        });

        const message = isAutoSubmit
          ? `Time's up! Assessment submitted automatically with ${answeredCount} answers.`
          : `Assessment submitted successfully with ${answeredCount} answers!`;
        toast.success(message);

        const resultId = response.data?.result?.id;
        if (resultId) {
          const resultSlug = (response.data?.result?.slug as string) || "";
          const target =
            resultSlug && typeof resultSlug === "string"
              ? resultSlug
              : String(resultId);
          router.push(`/skill-assessments/results/${target}`);
        } else {
          router.push("/skill-assessments/dashboard");
        }
      } catch (error: any) {
        setSubmitting(false);
        setIsSubmitted(false);

        if (
          error.response?.status === 403 &&
          error.response?.data?.code === "ASSESSMENT_LIMIT_EXCEEDED"
        ) {
          toast.error(
            `Assessment limit reached! ${error.response.data.message}`
          );
        } else {
          toast.error(
            error.response?.data?.message || "Failed to submit assessment"
          );
        }
      }
    },
    [params, router]
  );

  return { submitAssessmentData };
}
