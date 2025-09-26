import { apiCall } from "@/helper/axios";
import toast from "react-hot-toast";
import { Payment } from "../types";

export const loadPaymentHistory = async (): Promise<Payment[]> => {
  try {
    // Get all subscriptions which include payment history
    const response = await apiCall.get('/subscription/subscriptions');
    const subscriptions = response.data;
    
    // Extract all payments from subscriptions
    const allPayments = subscriptions.flatMap((sub: any) => 
      sub.payments?.map((payment: any) => ({
        ...payment,
        subscription: sub
      })) || []
    );

    // Sort by creation date (newest first)
    const sortedPayments = allPayments.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sortedPayments;
  } catch (error) {
    console.error('Error loading payment history:', error);
    toast.error('Failed to load payment history');
    throw error;
  }
};

export const filterPayments = (
  payments: Payment[],
  searchTerm: string,
  statusFilter: string
): Payment[] => {
  let filtered = [...payments];

  // Search filter
  if (searchTerm) {
    filtered = filtered.filter(payment => 
      payment.subscription.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.subscription.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.subscription.plan.planName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Status filter
  if (statusFilter !== "all") {
    filtered = filtered.filter(payment => payment.status === statusFilter);
  }

  return filtered;
};
