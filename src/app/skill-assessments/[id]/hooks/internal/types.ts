export interface Question {
  id: number;
  question: string;
  options: string[];
}

export interface Assessment {
  id: number;
  slug?: string;
  title: string;
  description?: string;
  passScore: number;
  questions: Question[];
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
}
