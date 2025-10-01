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

// Get assessment results
export const getAssessmentResults = async (assessmentId: number) => {
  const response = await apiCall.get(`/skill-assessment/assessments/${assessmentId}/results`);
  return response.data;
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
}) => {
  const response = await apiCall.patch(`/skill-assessment/badge-templates/${id}`, data);
  return response.data;
};

// Delete badge template
export const deleteBadgeTemplate = async (id: number) => {
  const response = await apiCall.delete(`/skill-assessment/badge-templates/${id}`);
  return response.data;
};
