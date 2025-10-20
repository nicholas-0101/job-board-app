import { apiCall } from "@/helper/axios";

export const getAssessmentForUser = async (assessmentId: number) => {
  try {
    const response = await apiCall.get(
      `/skill-assessment/assessments/${assessmentId}/take`
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 403) {
      const errorData = error.response.data;
      if (errorData.code === "SUBSCRIPTION_REQUIRED") {
        throw new Error(
          "Active subscription required to access skill assessments"
        );
      } else if (errorData.code === "ASSESSMENT_LIMIT_EXCEEDED") {
        throw new Error(`Assessment limit reached: ${errorData.message}`);
      }
      throw new Error(errorData.message || "Access denied");
    }

    throw error;
  }
};

export const getAssessmentForUserBySlug = async (slug: string) => {
  const response = await apiCall.get(
    `/skill-assessment/assessments/slug/${slug}/take`
  );
  return response.data;
};

export const submitAssessment = async (data: {
  assessmentId: number;
  startedAt: string;
  answers: Array<{ questionId: number; answer: string }>;
}) => {
  try {
    const response = await apiCall.post(
      `/skill-assessment/assessments/${data.assessmentId}/submit`,
      {
        startedAt: data.startedAt,
        answers: data.answers,
      }
    );

    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const getUserResults = async () => {
  try {
    const response = await apiCall.get("/skill-assessment/user/results");
    return response.data;
  } catch (error: any) {
    throw error;
  }
};
