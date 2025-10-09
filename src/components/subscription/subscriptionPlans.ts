import { Crown, Briefcase } from "lucide-react";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  popular: boolean;
  backgroundColor: string;
  icon: any;
  features: string[];
  limitations: string[];
  duration: number; // days
  assessmentLimit?: number; // undefined = unlimited
}

export const SUBSCRIPTION_CONFIG = {
  DURATION_DAYS: 30,
  REMINDER_DAYS_BEFORE: 1,
  COLORS: {
    STANDARD: '#467EC7',
    PROFESSIONAL: '#24CFA7',
    ACCENT: '#A3B6CE',
    BACKGROUND: '#F0F5F9'
  }
} as const;

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "standard",
    name: "Standard",
    price: 25000,
    originalPrice: 25000,
    period: "month",
    popular: false,
    backgroundColor: SUBSCRIPTION_CONFIG.COLORS.STANDARD,
    icon: Briefcase,
    duration: SUBSCRIPTION_CONFIG.DURATION_DAYS,
    assessmentLimit: 2,
    features: [
      "CV Generator access",
      "Skill Assessment (2x per month)",
      "Email reminders H-1 expiry",
      "ATS-friendly CV templates"
    ],
    limitations: ["Limited skill assessments", "Standard support"],
  },
  {
    id: "professional",
    name: "Professional", 
    price: 100000,
    originalPrice: 100000,
    period: "month",
    popular: true,
    backgroundColor: SUBSCRIPTION_CONFIG.COLORS.PROFESSIONAL,
    icon: Crown,
    duration: SUBSCRIPTION_CONFIG.DURATION_DAYS,
    assessmentLimit: undefined, // unlimited
    features: [
      "CV Generator access",
      "Unlimited Skill Assessment",
      "Priority job application review",
      "Exclusive premium templates",
      "Priority customer support"
    ],
    limitations: [],
  },
];
