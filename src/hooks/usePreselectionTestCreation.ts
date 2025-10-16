import { useState } from "react";

interface Question {
  question: string;
  options: string[];
  answer: string;
}

export function usePreselectionTestCreation() {
  const [testQuestions, setTestQuestions] = useState<Question[]>([]);
  const [passingScore, setPassingScore] = useState(20);
  const [isTestActive, setIsTestActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const validateTest = () => {
    setError(null);
    if (!isTestActive) {
      return { valid: true, message: "" };
    }
    
    if (testQuestions.length !== 25) {
      const message = "Pre-selection test must contain exactly 25 questions";
      setError(message);
      return { valid: false, message };
    }
    
    for (let i = 0; i < testQuestions.length; i++) {
      const q = testQuestions[i];
      if (!q.question.trim()) {
        const message = `Question ${i + 1} is empty`;
        setError(message);
        return { valid: false, message };
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        const message = `Question ${i + 1} must have 4 options`;
        setError(message);
        return { valid: false, message };
      }
      if (q.options.some((opt) => !opt.trim())) {
        const message = `All options must be filled for question ${i + 1}`;
        setError(message);
        return { valid: false, message };
      }
      if (!q.answer.trim() || !q.options.includes(q.answer)) {
        const message = `Answer for question ${i + 1} must match one of the options`;
        setError(message);
        return { valid: false, message };
      }
    }
    
    return { valid: true, message: "" };
  };

  const getTestData = () => {
    return {
      questions: testQuestions,
      passingScore,
      isActive: isTestActive,
    };
  };

  return {
    testQuestions,
    setTestQuestions,
    passingScore,
    setPassingScore,
    isTestActive,
    setIsTestActive,
    addQuestion,
    updateQuestion,
    removeQuestion,
    validateTest,
    getTestData,
    error,
    clearError: () => setError(null),
  };
}
