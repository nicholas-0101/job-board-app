import { CVFormData, WorkExperience, Project, Education, Certification, Language } from "./types";

export const createWorkExperienceHelpers = (
  formData: CVFormData,
  onInputChange: (field: keyof CVFormData, value: any) => void
) => {
  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      responsibilities: ['']
    };
    onInputChange('workExperience', [...formData.workExperience, newExperience]);
  };

  const removeWorkExperience = (index: number) => {
    const updated = formData.workExperience.filter((_, i) => i !== index);
    onInputChange('workExperience', updated);
  };

  const updateWorkExperience = (index: number, field: keyof WorkExperience, value: any) => {
    const updated = [...formData.workExperience];
    updated[index] = { ...updated[index], [field]: value };
    onInputChange('workExperience', updated);
  };

  return { addWorkExperience, removeWorkExperience, updateWorkExperience };
};

export const createProjectHelpers = (
  formData: CVFormData,
  onInputChange: (field: keyof CVFormData, value: any) => void
) => {
  const addProject = () => {
    const newProject: Project = {
      name: '',
      description: '',
      technologies: [''],
      url: ''
    };
    onInputChange('projects', [...formData.projects, newProject]);
  };

  const removeProject = (index: number) => {
    const updated = formData.projects.filter((_, i) => i !== index);
    onInputChange('projects', updated);
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...formData.projects];
    updated[index] = { ...updated[index], [field]: value };
    onInputChange('projects', updated);
  };

  return { addProject, removeProject, updateProject };
};

export const createEducationHelpers = (
  formData: CVFormData,
  onInputChange: (field: keyof CVFormData, value: any) => void
) => {
  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      year: '',
      gpa: ''
    };
    onInputChange('educationDetails', [...formData.educationDetails, newEducation]);
  };

  const removeEducation = (index: number) => {
    const updated = formData.educationDetails.filter((_, i) => i !== index);
    onInputChange('educationDetails', updated);
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...formData.educationDetails];
    updated[index] = { ...updated[index], [field]: value };
    onInputChange('educationDetails', updated);
  };

  return { addEducation, removeEducation, updateEducation };
};

export const createCertificationHelpers = (
  formData: CVFormData,
  onInputChange: (field: keyof CVFormData, value: any) => void
) => {
  const addCertification = () => {
    const newCertification: Certification = {
      name: '',
      issuer: '',
      date: '',
      link: ''
    };
    onInputChange('certifications', [...formData.certifications, newCertification]);
  };

  const removeCertification = (index: number) => {
    const updated = formData.certifications.filter((_, i) => i !== index);
    onInputChange('certifications', updated);
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...formData.certifications];
    updated[index] = { ...updated[index], [field]: value };
    onInputChange('certifications', updated);
  };

  return { addCertification, removeCertification, updateCertification };
};

export const createLanguageHelpers = (
  formData: CVFormData,
  onInputChange: (field: keyof CVFormData, value: any) => void
) => {
  const addLanguage = () => {
    const newLanguage: Language = {
      name: '',
      level: ''
    };
    onInputChange('languages', [...formData.languages, newLanguage]);
  };

  const removeLanguage = (index: number) => {
    const updated = formData.languages.filter((_, i) => i !== index);
    onInputChange('languages', updated);
  };

  const updateLanguage = (index: number, field: keyof Language, value: string) => {
    const updated = [...formData.languages];
    updated[index] = { ...updated[index], [field]: value };
    onInputChange('languages', updated);
  };

  return { addLanguage, removeLanguage, updateLanguage };
};
