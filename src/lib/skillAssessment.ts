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
  const response = await apiCall.get(`/skill-assessment/developer/assessments/${assessmentId}`);
  return response.data;
};

// Get assessment with results combined
export const getAssessmentWithResults = async (assessmentId: number) => {
  try {
    // Get assessment details first
    const assessmentRes = await apiCall.get(`/skill-assessment/developer/assessments/${assessmentId}`);
    const assessment = assessmentRes.data?.data || assessmentRes.data || null;
    
    // Try to get results, but don't fail if no results exist
    let results = [];
    try {
      const resultsRes = await apiCall.get(`/skill-assessment/assessments/${assessmentId}/results`);
      results = resultsRes.data?.data?.results || resultsRes.data?.results || resultsRes.data || [];
    } catch (resultsError: any) {
      console.log("No results found for assessment:", assessmentId);
      results = [];
    }
    
    return {
      assessment,
      results
    };
  } catch (error: any) {
    console.error("Error fetching assessment with results:", error);
    throw error;
  }
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
  try {
    console.log('🎯 Frontend: Calling /take endpoint for assessment:', assessmentId);
    const response = await apiCall.get(`/skill-assessment/assessments/${assessmentId}/take`);
    console.log('✅ Frontend: /take endpoint success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Frontend: Error fetching assessment for user:", {
      assessmentId,
      status: error.response?.status,
      error: error.response?.data || error.message,
    });
    
    if (error.response?.status === 403) {
      const errorData = error.response.data;
      if (errorData.code === "SUBSCRIPTION_REQUIRED") {
        throw new Error("Active subscription required to access skill assessments");
      } else if (errorData.code === "ASSESSMENT_LIMIT_EXCEEDED") {
        throw new Error(`Assessment limit reached: ${errorData.message}`);
      }
      throw new Error(errorData.message || "Access denied");
    }
    
    throw error;
  }
};

// Submit assessment answers
export const submitAssessment = async (data: {
  assessmentId: number;
  startedAt: string;
  answers: Array<{ questionId: number; answer: string }>;
}) => {
  try {
    const response = await apiCall.post(`/skill-assessment/assessments/${data.assessmentId}/submit`, {
      startedAt: data.startedAt,
      answers: data.answers
    });
    
    return response.data;
  } catch (error: any) {
    console.error("Submit error:", error.response?.data || error.message);
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
    const response = await apiCall.get("/skill-assessment/user/results");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user results:", {
      status: error.response?.status,
      message: error.response?.data?.message
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
