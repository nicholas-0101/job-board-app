import { apiCall } from "@/helper/axios";
import toast from "react-hot-toast";
import { Payment } from "../types";

export const loadPendingPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiCall.get('/subscription/subscriptions');
    const subscriptions = response.data;
    
    // Extract only pending payments from subscriptions
    const pendingPayments = subscriptions.flatMap((sub: any) => 
      sub.payments?.filter((payment: any) => payment.status === 'PENDING')
        .map((payment: any) => ({
          ...payment,
          subscription: sub
        })) || []
    );

    // Sort by creation date (oldest first for pending - most urgent)
    const sortedPayments = pendingPayments.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sortedPayments;
  } catch (error) {
    console.error('Error loading pending payments:', error);
    toast.error('Failed to load pending payments');
    throw error;
  }
};

export const approvePendingPayment = async (paymentId: number): Promise<void> => {
  try {
    await apiCall.put(`/subscription/approve-payment/${paymentId}`);
    toast.success('Payment approved successfully!');
  } catch (error: any) {
    console.error('Error approving payment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to approve payment';
    toast.error(errorMessage);
    throw error;
  }
};

export const rejectPendingPayment = async (paymentId: number): Promise<void> => {
  try {
    await apiCall.put(`/subscription/reject-payment/${paymentId}`);
    toast.success('Payment rejected successfully!');
  } catch (error: any) {
    console.error('Error rejecting payment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to reject payment';
    toast.error(errorMessage);
    throw error;
  }
};
