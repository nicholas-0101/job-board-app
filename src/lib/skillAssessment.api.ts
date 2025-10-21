import { apiCall } from "@/helper/axios";

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface CreateAssessmentData {
  title: string;
  description?: string;
  category: string;
  badgeTemplateId?: number;
  passScore?: number;
  questions: Question[];
}

export interface Assessment {
  id: number;
  title: string;
  description?: string;
  passScore: number;
  createdBy: number;
  badgeTemplateId?: number;
  createdAt: string;
  questionCount?: number;
  attemptCount?: number;
  passRate?: number;
}

export const createAssessment = async (data: CreateAssessmentData) => {
  const response = await apiCall.post("/skill-assessment/assessments", data);
  return response.data;
};

export const getAssessments = async (page: number = 1, limit: number = 10) => {
  const response = await apiCall.get(
    `/skill-assessment/assessments?page=${page}&limit=${limit}`
  );
  return response.data;
};

export const getDeveloperAssessments = async () => {
  const response = await apiCall.get("/skill-assessment/developer/assessments");
  return response.data;
};

export const getAssessmentById = async (assessmentId: number) => {
  const response = await apiCall.get(
    `/skill-assessment/developer/assessments/${assessmentId}`
  );
  return response.data;
};

export const getAssessmentWithResults = async (assessmentId: number) => {
  try {
    const assessmentRes = await apiCall.get(
      `/skill-assessment/developer/assessments/${assessmentId}`
    );
    const assessment = assessmentRes.data?.data || assessmentRes.data || null;

    let results = [];
    try {
      const resultsRes = await apiCall.get(
        `/skill-assessment/assessments/${assessmentId}/results`
      );
      results =
        resultsRes.data?.data?.results ||
        resultsRes.data?.results ||
        resultsRes.data ||
        [];
    } catch (resultsError: any) {
      results = [];
    }

    return {
      assessment,
      results,
    };
  } catch (error: any) {
    throw error;
  }
};

export const updateAssessment = async (
  assessmentId: number,
  data: Partial<CreateAssessmentData>
) => {
  const response = await apiCall.patch(
    `/skill-assessment/assessments/${assessmentId}`,
    data
  );
  return response.data;
};

export const deleteAssessment = async (assessmentId: number) => {
  const response = await apiCall.delete(
    `/skill-assessment/assessments/${assessmentId}`
  );
  return response.data;
};

export const getAssessmentResults = async (assessmentId: number) => {
  const response = await apiCall.get(
    `/skill-assessment/assessments/${assessmentId}/results`
  );
  return response.data;
};

export const saveQuestion = async (data: {
  assessmentId: number;
  question: string;
  options: string[];
  answer: string;
}) => {
  const response = await apiCall.post(
    "/skill-assessment/assessments/questions",
    data
  );
  return response.data;
};

export const getAssessmentBySlug = async (slug: string) => {
  const response = await apiCall.get(
    `/skill-assessment/developer/assessments/slug/${slug}`
  );
  return response.data;
};
