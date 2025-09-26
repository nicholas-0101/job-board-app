"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../components/DeveloperLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Clock,
  Eye,
  Building,
  Mail,
  Phone,
  AlertTriangle,
  FileText,
  Download,
  X,
  XCircle,
  CreditCard
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiCall } from "@/helper/axios";
import toast from "react-hot-toast";
// Interface untuk pending payment data sesuai backend
interface PendingPayment {
  id: number;
  subscriptionId: number;
  paymentMethod: 'TRANSFER' | 'GATEWAY';
  paymentProof?: string;
  status: 'PENDING';
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

export default function PendingApprovalsPage() {
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load pending payments from backend
  useEffect(() => {
    loadPendingPayments();
  }, []);

  const loadPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await apiCall.get('/subscription/pending-payments');
      setPendingPayments(response.data);
    } catch (error) {
      console.error('Error loading pending payments:', error);
      toast.error('Failed to load pending payments');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const submitted = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Standard": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Professional": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleApprove = async (paymentId: number) => {
    try {
      await apiCall.patch(`/subscription/payments/${paymentId}/approve`);
      toast.success('Payment approved successfully');
      loadPendingPayments(); // Reload data
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    }
  };

  const handleReject = async (paymentId: number) => {
    try {
      await apiCall.patch(`/subscription/payments/${paymentId}/reject`);
      toast.success('Payment rejected successfully');
      loadPendingPayments(); // Reload data
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const handleViewPaymentProof = (paymentProof: string) => {
    setSelectedPaymentProof(paymentProof);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentProof(null);
  };

  const totalPendingValue = pendingPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg mt-4 mb-8">
          <div className="px-6 py-8">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <h1 className="text-3xl font-bold text-[#467EC7]">
                  Pending Approvals
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Review and approve subscription payment requests
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {pendingPayments.length} Pending
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingPayments.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Potential Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-[#24CFA7]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPendingValue)}</div>
              <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading pending payments...</div>
            </div>
          ) : pendingPayments.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                <p className="text-gray-600 text-center">
                  No pending subscription requests at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingPayments.map((payment) => (
              <Card key={payment.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {payment.subscription.user.name || payment.subscription.user.email}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getPlanColor(payment.subscription.plan.planName)}>
                          {payment.subscription.plan.planName} Plan
                        </Badge>
                        <Badge variant="outline" className="border-green-200 text-green-700">
                          {formatCurrency(payment.amount)}/month
                        </Badge>
                        <Badge variant="outline" className="border-gray-200">
                          {payment.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(payment.createdAt)}
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 border-b pb-2">User Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm">{payment.subscription.user.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building className="w-4 h-4 text-gray-500 flex-shrink-0" />
                          <span className="text-sm">{payment.subscription.user.name || "Individual User"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 border-b pb-2">Payment Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Plan Type:</span>
                          <span className="text-sm font-medium">{payment.subscription.plan.planName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Plan Price:</span>
                          <span className="text-sm font-medium">{formatCurrency(payment.subscription.plan.planPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Payment Amount:</span>
                          <span className="text-sm font-bold text-green-600">{formatCurrency(payment.amount)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Payment Method:</span>
                          <span className="text-sm font-medium">{payment.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Payment Proof:</span>
                          {payment.paymentProof ? (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-[#467EC7] border-[#467EC7] hover:bg-[#467EC7]/10"
                              onClick={() => handleViewPaymentProof(payment.paymentProof!)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-xs">No proof uploaded</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 border-red-600 hover:bg-red-50 hover:border-red-700"
                      onClick={() => handleReject(payment.id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Request
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      onClick={() => handleApprove(payment.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve & Activate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Payment Proof Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Payment Proof</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center p-4">
              {selectedPaymentProof ? (
                <div className="relative w-full h-full">
                  <img
                    src={selectedPaymentProof}
                    alt="Payment Proof"
                    className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.png';
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No payment proof available</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
