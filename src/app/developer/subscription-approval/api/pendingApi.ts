import { apiCall } from "@/helper/axios";
import toast from "react-hot-toast";
import { Payment } from "../types";

export const loadPendingPayments = async (): Promise<Payment[]> => {
  try {
    const response = await apiCall.get('/subscription/pending-payments');
    return response.data;
  } catch (error) {
    console.error('Error loading pending payments:', error);
    toast.error('Failed to load pending payments');
    throw error;
  }
};

// Updated to use slug-based endpoints for better security
export const approvePendingPayment = async (paymentSlug: string): Promise<void> => {
  try {
    await apiCall.patch(`/subscription/payments/slug/${paymentSlug}/approve`);
    toast.success('Payment approved successfully!');
  } catch (error: any) {
    console.error('Error approving payment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to approve payment';
    toast.error(errorMessage);
    throw error;
  }
};

export const rejectPendingPayment = async (paymentSlug: string): Promise<void> => {
  try {
    await apiCall.patch(`/subscription/payments/slug/${paymentSlug}/reject`);
    toast.success('Payment rejected successfully!');
  } catch (error: any) {
    console.error('Error rejecting payment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to reject payment';
    toast.error(errorMessage);
    throw error;
  }
};

// Fallback functions for backward compatibility (if needed)
export const approvePendingPaymentById = async (paymentId: number): Promise<void> => {
  try {
    await apiCall.patch(`/subscription/payments/${paymentId}/approve`);
    toast.success('Payment approved successfully!');
  } catch (error: any) {
    console.error('Error approving payment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to approve payment';
    toast.error(errorMessage);
    throw error;
  }
};

export const rejectPendingPaymentById = async (paymentId: number): Promise<void> => {
  try {
    await apiCall.patch(`/subscription/payments/${paymentId}/reject`);
    toast.success('Payment rejected successfully!');
  } catch (error: any) {
    console.error('Error rejecting payment:', error);
    const errorMessage = error.response?.data?.message || 'Failed to reject payment';
    toast.error(errorMessage);
    throw error;
  }
};
