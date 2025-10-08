import { apiCall } from "@/helper/axios";

export const fetchUserSubscriptions = async () => {
  const response = await apiCall.get("/subscription/my-subscriptions");
  return response.data;
};

export const fetchUserData = async () => {
  const response = await apiCall.get("/auth/keep");
  return response.data.data;
};

export const findPaymentInSubscription = async (subscriptionId: number, paymentId: string) => {
  try {
    const response = await apiCall.get(`/subscription/subscriptions/${subscriptionId}/payments`);
    const payments = response.data;
    return payments.find((p: any) => p.id.toString() === paymentId);
  } catch (error) {
    return null;
  }
};

export const searchPaymentInAllSubscriptions = async (subscriptions: any[], paymentId: string) => {
  for (const subscription of subscriptions) {
    const payment = await findPaymentInSubscription(subscription.id, paymentId);
    if (payment) {
      return payment;
    }
  }
  return null;
};

export const createBasicPaymentObject = (paymentId: string, subscription: any) => {
  return {
    id: paymentId,
    status: 'pending',
    amount: subscription.plan?.price || 0
  };
};

export const buildTransactionData = (subscription: any, payment: any, userData: any) => {
  return {
    subscription,
    payment,
    customer: {
      name: userData.fullName || userData.name || "Customer",
      email: userData.email || "customer@example.com"
    }
  };
};
