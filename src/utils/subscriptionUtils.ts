import { SUBSCRIPTION_CONFIG } from "@/components/subscription/subscriptionPlans";

export interface SubscriptionStatus {
  isActive: boolean;
  daysRemaining?: number;
  expiresAt?: Date;
  planType?: string;
}

// Calculate days remaining until expiry
export const calculateDaysRemaining = (expiryDate: string | Date): number => {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Check if subscription needs reminder
export const needsReminderEmail = (expiryDate: string | Date): boolean => {
  const daysRemaining = calculateDaysRemaining(expiryDate);
  return daysRemaining <= SUBSCRIPTION_CONFIG.REMINDER_DAYS_BEFORE;
};

// Format subscription expiry date
export const formatExpiryDate = (expiryDate: string | Date): string => {
  return new Date(expiryDate).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate subscription end date from start date
export const calculateExpiryDate = (startDate: Date = new Date()): Date => {
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + SUBSCRIPTION_CONFIG.DURATION_DAYS);
  return expiry;
};

// Check if user can access feature based on subscription
export const canAccessFeature = (
  hasSubscription: boolean, 
  feature: 'cv_generator' | 'skill_assessment' | 'priority_review'
): boolean => {
  if (!hasSubscription) return false;
  
  switch (feature) {
    case 'cv_generator':
      return true; // Available in both plans
    case 'skill_assessment':
      return true; // Available in both plans (with limits)
    case 'priority_review':
      return true; // Need to check plan type in real implementation
    default:
      return false;
  }
};
