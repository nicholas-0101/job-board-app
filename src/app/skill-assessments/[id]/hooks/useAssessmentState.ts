import useAssessmentStateCore from "./internal/useAssessmentState.core";

export function useAssessmentState(assessmentIdOrSlug: number | string) {
  return useAssessmentStateCore(assessmentIdOrSlug);
}
