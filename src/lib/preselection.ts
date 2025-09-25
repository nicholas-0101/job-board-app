import { apiCall } from "@/helper/axios";

export interface PreselectionQuestionDTO {
  id: number;
  question: string;
  options: string[];
}

export interface PreselectionTestDTO {
  id: number;
  jobId: number;
  isActive: boolean;
  passingScore?: number | null;
  questions: PreselectionQuestionDTO[];
}

export async function fetchPreselectionTest(jobId: number) {
  const res = await apiCall.get<{ success: boolean; data: PreselectionTestDTO }>(
    `/preselection/jobs/${jobId}/tests`
  );
  return res.data.data;
}

export async function submitPreselectionAnswers(params: {
  applicantId: number;
  testId: number;
  answers: Array<{ questionId: number; selected: string }>;
}) {
  const { applicantId, testId, answers } = params;
  const res = await apiCall.post(`/preselection/applicants/${applicantId}/tests/${testId}/submit`, {
    answers,
  });
  return res.data;
}


