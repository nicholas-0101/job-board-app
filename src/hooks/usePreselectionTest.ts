import { useState, useEffect } from "react";
import { upsertPreselectionTest, fetchPreselectionTest } from "@/lib/preselection";
import { apiCall } from "@/helper/axios";

interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
}

export function usePreselectionTest(jobId: number) {
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [passingScore, setPassingScore] = useState(20);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testLoaded, setTestLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const test = await fetchPreselectionTest(jobId);
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
    })();
  }, [jobId]);

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

  return {
    testQuestions,
    passingScore,
    isTestActive,
    testLoaded,
    setPassingScore,
    setIsTestActive,
    addQuestion,
    updateQuestion,
    removeQuestion,
    saveTest,
  };
}
