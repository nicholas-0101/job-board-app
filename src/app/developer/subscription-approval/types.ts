// Interface sesuai dengan backend Prisma schema
export interface Payment {
  id: number;
  subscriptionId: number;
  paymentMethod: 'TRANSFER' | 'GATEWAY';
  paymentProof?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  amount: string; // Decimal dari Prisma jadi string
  approvedAt?: string;
  gatewayTransactionId?: string;
  createdAt: string;
  expiredAt?: string;
  subscription: {
    id: number;
    userId: number;
    subscriptionPlanId: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    createdAt: string;
    user: {
      id: number;
      name: string;
      email: string;
    };
    plan: {
      id: number;
      planName: string;
      planPrice: string;
      planDescription?: string;
    };
  };
}

export const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" }
];
