import { apiCall } from "@/helper/axios";

export interface Question {
  question: string;
  options: string[];
  answer: string;
}

export interface CreateAssessmentData {
  title: string;
  description?: string;
  badgeTemplateId?: number;
  questions: Question[];
}

export interface Assessment {
  id: number;
  title: string;
  description?: string;
  createdBy: number;
  badgeTemplateId?: number;
  createdAt: string;
  questionCount?: number;
  attemptCount?: number;
  passRate?: number;
}

export interface BadgeTemplate {
  id: number;
  name: string;
  icon?: string;
  description?: string;
  category?: string;
}

// Create new assessment
export const createAssessment = async (data: CreateAssessmentData) => {
  const response = await apiCall.post("/skill-assessment/assessments", data);
  return response.data;
};

// Get all assessments for users (public assessments)
export const getAssessments = async (page: number = 1, limit: number = 10) => {
  const response = await apiCall.get(`/skill-assessment/assessments?page=${page}&limit=${limit}`);
  return response.data;
};

// Get all assessments for developer
export const getDeveloperAssessments = async () => {
  const response = await apiCall.get("/skill-assessment/developer/assessments");
  return response.data;
};

// Get single assessment by ID (for developers to edit - includes questions)
export const getAssessmentById = async (assessmentId: number) => {
  console.log("Fetching assessment with ID:", assessmentId);
  const response = await apiCall.get(`/skill-assessment/developer/assessments/${assessmentId}`);
  console.log("Response from backend:", response);
  return response.data;
};

// Get assessment with results combined
export const getAssessmentWithResults = async (assessmentId: number) => {
  const [assessmentRes, resultsRes] = await Promise.all([
    apiCall.get(`/skill-assessment/developer/assessments`),
    apiCall.get(`/skill-assessment/assessments/${assessmentId}/results`)
  ]);
  
  const assessments = assessmentRes.data?.data || assessmentRes.data || [];
  const assessment = Array.isArray(assessments) 
    ? assessments.find((a: any) => a.id === assessmentId)
    : null;
  
  const results = resultsRes.data?.data || resultsRes.data || [];
  
  return {
    assessment,
    results
  };
};

// Update assessment
export const updateAssessment = async (assessmentId: number, data: Partial<CreateAssessmentData>) => {
  const response = await apiCall.patch(`/skill-assessment/assessments/${assessmentId}`, data);
  return response.data;
};

// Delete assessment
export const deleteAssessment = async (assessmentId: number) => {
  const response = await apiCall.delete(`/skill-assessment/assessments/${assessmentId}`);
  return response.data;
};

// Get assessment for user to take (without answers)
export const getAssessmentForUser = async (assessmentId: number) => {
  const response = await apiCall.get(`/skill-assessment/assessments/${assessmentId}/take`);
  return response.data;
};

// Submit assessment answers
export const submitAssessment = async (data: {
  assessmentId: number;
  startedAt: string;
  answers: Array<{ questionId: number; selectedAnswer: string }>;
}) => {
  try {
    
    const response = await apiCall.post(`/skill-assessment/assessments/${data.assessmentId}/submit`, {
      startedAt: data.startedAt,
      answers: data.answers
    });
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Get assessment results (for developers)
export const getAssessmentResults = async (assessmentId: number) => {
  const response = await apiCall.get(`/skill-assessment/assessments/${assessmentId}/results`);
  return response.data;
};

// Get user's assessment results
export const getUserResults = async () => {
  try {
    console.log("📊 Fetching user results from API...");
    const response = await apiCall.get("/skill-assessment/user/results");
    console.log("📋 User results API response:", {
      success: response.data.success,
      dataType: typeof response.data.data,
      hasResults: !!response.data.data?.results,
      resultsCount: response.data.data?.results?.length || 0,
      sampleData: response.data.data?.results?.[0] || null
    });
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching user results:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

// Get all badge templates
export const getAllBadgeTemplates = async () => {
  const response = await apiCall.get("/skill-assessment/badge-templates");
  return response.data;
};

// Get developer's badge templates
export const getDeveloperBadgeTemplates = async () => {
  const response = await apiCall.get("/skill-assessment/developer/badge-templates");
  return response.data;
};

// Create badge template
export const createBadgeTemplate = async (data: {
  name: string;
  description?: string;
  iconFile?: File;
  category?: string;
}) => {
  const formData = new FormData();
  formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.iconFile) formData.append('icon', data.iconFile);
  if (data.category) formData.append('category', data.category);

  const response = await apiCall.post("/skill-assessment/badge-templates", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update badge template
export const updateBadgeTemplate = async (id: number, data: {
  name?: string;
  description?: string;
  icon?: string;
  category?: string;
  iconFile?: File;
}) => {
  // If iconFile is provided, use FormData
  if (data.iconFile) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.category) formData.append('category', data.category);
    formData.append('icon', data.iconFile);

    const response = await apiCall.patch(`/skill-assessment/badge-templates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
  
  // Otherwise, use regular JSON
  const response = await apiCall.patch(`/skill-assessment/badge-templates/${id}`, data);
  return response.data;
};

// Delete badge template
export const deleteBadgeTemplate = async (id: number) => {
  const response = await apiCall.delete(`/skill-assessment/badge-templates/${id}`);
  return response.data;
};

// Save individual question
export const saveQuestion = async (data: {
  assessmentId: number;
  question: string;
  options: string[];
  answer: string;
}) => {
  const response = await apiCall.post("/skill-assessment/assessments/questions", data);
  return response.data;
};
