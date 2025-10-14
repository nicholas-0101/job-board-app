import { Briefcase, Crown } from "lucide-react";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  color: string; // solid background color to match subscription cards
  icon: any;
  features: string[];
}

export const subscriptionPlans = {
  standard: {
    id: "standard",
    name: "Standard",
    price: 25000,
    period: "month",
    color: "#467EC7",
    icon: Briefcase,
    features: ["CV Generator", "Skill Assessment 2x"],
  },
  professional: {
    id: "professional",
    name: "Professional",
    price: 100000,
    period: "month",
    color: "#24CFA7",
    icon: Crown,
    features: ["CV Generator", "Skill Assessment unlimited", "Priority review when apply job"],
  },
};
