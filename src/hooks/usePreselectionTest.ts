import { useEffect } from "react";
import { usePreselectionTestState } from "./usePreselectionTestState";
import { usePreselectionTestActions } from "./usePreselectionTestActions";

export function usePreselectionTest(jobId: number, shouldFetch: boolean = true) {
  const {
    testQuestions,
    setTestQuestions,
    passingScore,
    setPassingScore,
    isTestActive,
    setIsTestActive,
    testLoaded,
    setTestLoaded,
  } = usePreselectionTestState();

  const {
    loadTest,
    addQuestion,
    updateQuestion,
    removeQuestion,
    saveTest,
    saveDraft,
    deleteTest,
  } = usePreselectionTestActions(
    jobId,
    shouldFetch,
    testQuestions,
    passingScore,
    setTestQuestions,
    setPassingScore,
    setIsTestActive,
    setTestLoaded
  );

  useEffect(() => {
    loadTest();
  }, [jobId, shouldFetch]);

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
    saveDraft,
    deleteTest,
  };
}
