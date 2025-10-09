export interface Assessment {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  badgeTemplate?: {
    id: number;
    name: string;
    icon?: string;
    category?: string;
  };
  creator: {
    id: number;
    name: string;
  };
  _count: {
    results: number;
    questions: number;
  };
}

export interface AssessmentStats {
  totalAssessments: number;
  totalParticipants: number;
}

export interface AssessmentFilters {
  category: string;
  sortBy: string;
}
