export interface CVTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  usageCount: number;
  rating: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  features: string[];
}

export interface GeneratedCV {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  templateName: string;
  fileName: string;
  fileUrl: string;
  downloadCount: number;
  createdAt: string;
  status: 'completed' | 'processing' | 'failed';
}
