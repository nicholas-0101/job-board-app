export interface RenewalInfo {
  currentSubscription: {
    id: number;
    status: string;
    expiresAt: string;
    plan: {
      name: string;
      priceIdr: number;
      perks: string[];
    };
  } | null;
  plan: {
    id: number;
    name: string;
    priceIdr: number;
    perks: string[];
  } | null;
  canRenew: boolean;
  renewalPrice: number;
  pendingPayment?: {
    id: number;
    amount: number;
    status: string;
    paymentProof?: string;
    expiresAt: string;
    subscription: {
      id: number;
      plan: {
        name: string;
      };
    };
  } | null;
  message?: string;
}
