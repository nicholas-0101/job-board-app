import { useState } from "react";

export interface TestQuestion {
  question: string;
  options: string[];
  answer: string;
}

export function usePreselectionTestState() {
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([]);
  const [passingScore, setPassingScore] = useState(20); // Default 20 correct answers (80%)
  const [isTestActive, setIsTestActive] = useState(false);
  const [testLoaded, setTestLoaded] = useState(false);

  return {
    testQuestions,
    setTestQuestions,
    passingScore,
    setPassingScore,
    isTestActive,
    setIsTestActive,
    testLoaded,
    setTestLoaded,
  };
}
