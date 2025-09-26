export interface SkillAssessment {
  id: number;
  title: string;
  category: string;
  questions: number;
  passRate: number;
  duration: number;
  status: 'active' | 'draft' | 'archived';
  participants: number;
  passedCount: number;
  createdAt: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}
