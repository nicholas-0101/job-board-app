export interface Badge {
  id: number;
  name: string;
  icon?: string;
  category?: string;
  description?: string;
  assessmentId: number;
  assessmentTitle: string;
  earned: boolean;
  earnedAt?: string;
  score?: number;
  certificateUrl?: string;
  certificateCode?: string;
}

export interface BadgeCategory {
  name: string;
  total: number;
  earned: number;
  badges: Badge[];
}

export interface BadgeStats {
  totalBadges: number;
  earnedBadges: number;
  completionRate: number;
  categories: Record<string, { total: number; earned: number }>;
}
