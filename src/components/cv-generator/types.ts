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

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[] | string;
  url?: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
  gpa?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface CVFormData {
  templateId: string;
  templateType: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  objective: string;
  linkedin?: string;
  portfolio?: string;
  projects: Project[];
  workExperience: WorkExperience[];
  educationDetails: Education[];
  certifications: Certification[];
  skills: string[] | string;
  skillCategories: {
    [category: string]: string[];
  };
  languages: Language[];
}
