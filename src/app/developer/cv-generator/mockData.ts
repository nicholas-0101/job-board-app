import { CVTemplate, GeneratedCV } from "./types";

export const mockTemplates: CVTemplate[] = [
  {
    id: 1,
    name: "ATS-Friendly Professional",
    description: "Clean, simple template optimized for Applicant Tracking Systems",
    category: "ATS-Optimized",
    thumbnail: "/templates/ats-professional.jpg",
    usageCount: 245,
    rating: 4.8,
    status: "active",
    createdAt: "2024-01-15",
    features: ["ATS-Compatible", "Clean Layout", "Professional", "Single Column"]
  },
  {
    id: 2,
    name: "Modern Creative",
    description: "Contemporary design with subtle colors and modern typography",
    category: "Creative",
    thumbnail: "/templates/modern-creative.jpg",
    usageCount: 189,
    rating: 4.6,
    status: "active",
    createdAt: "2024-01-20",
    features: ["Modern Design", "Color Accents", "Two Column", "Creative"]
  },
  {
    id: 3,
    name: "Executive Professional",
    description: "Premium template for senior-level positions and executives",
    category: "Executive",
    thumbnail: "/templates/executive-professional.jpg",
    usageCount: 156,
    rating: 4.9,
    status: "active",
    createdAt: "2024-01-25",
    features: ["Executive Level", "Premium Design", "Elegant", "Professional"]
  },
  {
    id: 4,
    name: "Tech Specialist",
    description: "Designed specifically for technology and engineering roles",
    category: "Technology",
    thumbnail: "/templates/tech-specialist.jpg",
    usageCount: 98,
    rating: 4.7,
    status: "draft",
    createdAt: "2024-02-01",
    features: ["Tech Focus", "Skills Highlight", "Project Showcase", "Modern"]
  }
];

export const mockGeneratedCVs: GeneratedCV[] = [
  {
    id: 1,
    userId: 101,
    userName: "John Doe",
    userEmail: "john@example.com",
    templateName: "ATS-Friendly Professional",
    fileName: "john_doe_cv_2024.pdf",
    fileUrl: "/generated-cvs/john_doe_cv_2024.pdf",
    downloadCount: 5,
    createdAt: "2024-02-10T14:30:00Z",
    status: "completed"
  },
  {
    id: 2,
    userId: 102,
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    templateName: "Modern Creative",
    fileName: "jane_smith_cv_2024.pdf",
    fileUrl: "/generated-cvs/jane_smith_cv_2024.pdf",
    downloadCount: 2,
    createdAt: "2024-02-12T09:15:00Z",
    status: "completed"
  },
  {
    id: 3,
    userId: 103,
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    templateName: "Executive Professional",
    fileName: "mike_johnson_cv_2024.pdf",
    fileUrl: "/generated-cvs/mike_johnson_cv_2024.pdf",
    downloadCount: 8,
    createdAt: "2024-02-14T16:45:00Z",
    status: "completed"
  },
  {
    id: 4,
    userId: 104,
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    templateName: "Tech Specialist",
    fileName: "sarah_wilson_cv_2024.pdf",
    fileUrl: "/generated-cvs/sarah_wilson_cv_2024.pdf",
    downloadCount: 0,
    createdAt: "2024-02-15T11:20:00Z",
    status: "processing"
  }
];
