export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface GeneratedCV {
  id: number;
  fileUrl: string;
  templateUsed: string;
  createdAt: string;
  // Optional fields that might be added by management service
  downloadUrl?: string;
  publicUrl?: string;
  originalUrl?: string;
}

export interface CVFormData {
  templateId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  languages: string;
  certifications: string;
  linkedin?: string;
  portfolio?: string;
}
