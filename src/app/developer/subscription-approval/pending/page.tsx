"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { Payment } from "../types";
import { loadPendingPayments, approvePendingPayment, rejectPendingPayment } from "../api/pendingApi";
import PendingStats from "../components/PendingStats";
import PendingPaymentCard from "../components/PendingPaymentCard";
import PaymentProofModal from "../components/PaymentProofModal";

export default function PendingApprovalsPage() {
  const [pendingPayments, setPendingPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayments, setProcessingPayments] = useState<Set<number>>(new Set());
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const paymentData = await loadPendingPayments();
      setPendingPayments(paymentData);
    } catch (error) {
      // Error handling is done in the API function
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: number) => {
    setProcessingPayments(prev => new Set(prev).add(paymentId));
    try {
      await approvePendingPayment(paymentId);
      await loadPayments(); // Reload data
    } catch (error) {
      // Error handling is done in the API function
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const handleReject = async (paymentId: number) => {
    setProcessingPayments(prev => new Set(prev).add(paymentId));
    try {
      await rejectPendingPayment(paymentId);
      await loadPayments(); // Reload data
    } catch (error) {
      // Error handling is done in the API function
    } finally {
      setProcessingPayments(prev => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const handleViewProof = (proofUrl: string) => {
    setSelectedPaymentProof(proofUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentProof(null);
  };

  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const urgentPayments = pendingPayments.filter(p => getDaysAgo(p.createdAt) > 3);

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
                <p className="text-gray-600">Review and process pending payment requests</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {pendingPayments.length > 0 && (
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{pendingPayments.length} Pending</span>
                </Badge>
              )}
              
              {urgentPayments.length > 0 && (
                <Badge variant="destructive" className="flex items-center space-x-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{urgentPayments.length} Urgent</span>
                </Badge>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <PendingStats payments={pendingPayments} />

          {/* Pending Payments List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Pending Payment Requests ({pendingPayments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467EC7]"></div>
                </div>
              ) : pendingPayments.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pending Approvals</h3>
                  <p className="text-gray-500">All payment requests have been processed.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((payment) => (
                    <PendingPaymentCard
                      key={payment.id}
                      payment={payment}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      onViewProof={handleViewProof}
                      isProcessing={processingPayments.has(payment.id)}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Proof Modal */}
          <PaymentProofModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            proofUrl={selectedPaymentProof}
          />
        </div>
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
