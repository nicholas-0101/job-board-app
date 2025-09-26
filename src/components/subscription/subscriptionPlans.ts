import { Check, Crown, Briefcase } from "lucide-react";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  period: string;
  popular: boolean;
  color: string;
  icon: any;
  features: string[];
  limitations: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "standard",
    name: "Standard",
    price: 25000,
    originalPrice: 25000,
    period: "month",
    popular: false,
    color: "from-blue-500 to-blue-600",
    icon: Briefcase,
    features: ["CV Generator", "Skill Assessment 2x"],
    limitations: [],
  },
  {
    id: "professional",
    name: "Professional",
    price: 100000,
    originalPrice: 100000,
    period: "month",
    popular: false,
    color: "from-purple-500 to-purple-600",
    icon: Crown,
    features: [
      "CV Generator",
      "Skill Assessment unlimited",
      "Priority review when apply job",
    ],
    limitations: [],
  },
];
