import { apiCall } from "@/helper/axios";

export interface PreselectionQuestionDTO {
  id: number;
  question: string;
  options: string[];
  // For admin role, backend includes the answer
  answer?: string;
}

export interface PreselectionTestDTO {
  id: number;
  jobId: number;
  isActive: boolean;
  passingScore?: number | null;
  questions: PreselectionQuestionDTO[];
}

export async function fetchPreselectionTest(jobId: number): Promise<PreselectionTestDTO | null> {
  try {
    const res = await apiCall.get<{ success: boolean; data: PreselectionTestDTO }>(
      `/preselection/jobs/${jobId}/tests`
    );
    return res.data.data;
  } catch (error: any) {
    // 404 is expected when job doesn't have a preselection test
    if (error.response?.status === 404) {
      return null;
    }
    // Log other errors
    console.error("Error fetching preselection test:", error.response?.data?.message || error.message);
    throw error;
  }
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

export async function upsertPreselectionTest(params: {
  jobId: number;
  isActive: boolean;
  passingScore: number;
  questions: Array<{ question: string; options: string[]; answer: string }>;
}) {
  const { jobId, isActive, passingScore, questions } = params;
  const res = await apiCall.post(`/preselection/jobs/${jobId}/tests`, {
    isActive,
    passingScore,
    questions,
  });
  return res.data;
}

export async function getMyPreselectionStatus(jobId: number) {
  const res = await apiCall.get<{ success: boolean; data: { required: boolean; testId?: number; submitted?: boolean; score?: number | null; passingScore?: number | null; isPassed?: boolean } }>(
    `/preselection/jobs/${jobId}/my-status`
  );
  return res.data.data;
}


