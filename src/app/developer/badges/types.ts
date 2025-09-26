export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  requirements: string;
  issuedCount: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
}

export interface Certificate {
  id: number;
  recipientName: string;
  recipientEmail: string;
  badgeName: string;
  assessmentScore: number;
  issuedAt: string;
  certificateId: string;
  qrCode: string;
  downloadCount: number;
  verified: boolean;
}
