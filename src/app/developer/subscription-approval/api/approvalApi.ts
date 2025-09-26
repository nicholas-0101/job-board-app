import { apiCall } from "@/helper/axios";
import toast from "react-hot-toast";
import { Payment } from "../types";

export const loadAllPayments = async (): Promise<Payment[]> => {
  try {
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
    console.error('Error loading payments:', error);
    toast.error('Failed to load payment data');
    throw error;
  }
};

export const approvePayment = async (paymentId: number): Promise<void> => {
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

export const rejectPayment = async (paymentId: number): Promise<void> => {
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

export const filterPaymentsByStatus = (
  payments: Payment[],
  selectedStatus: string
): Payment[] => {
  if (selectedStatus === "all") {
    return payments;
  }
  return payments.filter(payment => payment.status === selectedStatus);
};
