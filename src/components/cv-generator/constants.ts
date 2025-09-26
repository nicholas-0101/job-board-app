import { CVFormData } from "./types";

export const DEFAULT_FORM_DATA: CVFormData = {
  templateId: "ats",
  templateType: "ats",
  fullName: "",
  email: "",
  phone: "",
  address: "",
  objective: "",
  linkedin: "",
  portfolio: "",
  projects: [{
    name: "",
    description: "",
    technologies: [],
    url: ""
  }],
  workExperience: [{
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    responsibilities: []
  }],
  educationDetails: [{
    institution: "",
    degree: "",
    year: "",
    gpa: ""
  }],
  certifications: [{
    name: "",
    issuer: "",
    date: "",
    link: ""
  }],
  skills: [],
  skillCategories: {},
  languages: [{
    name: "",
    level: ""
  }]
};
