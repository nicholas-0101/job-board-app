"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Payment } from "./types";
import { loadAllPayments, approvePayment, rejectPayment, filterPaymentsByStatus } from "./api/approvalApi";
import ApprovalStats from "./components/ApprovalStats";
import ApprovalTable from "./components/ApprovalTable";
import PaymentProofModal from "./components/PaymentProofModal";

export default function SubscriptionApprovalPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [allPayments, setAllPayments] = useState<Payment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [processingPayments, setProcessingPayments] = useState<Set<number>>(new Set());
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const filtered = filterPaymentsByStatus(allPayments, selectedStatus);
    setPayments(filtered);
  }, [allPayments, selectedStatus]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const paymentData = await loadAllPayments();
      setAllPayments(paymentData);
    } catch (error) {
      // Error handling is done in the API function
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (paymentId: number) => {
    setProcessingPayments(prev => new Set(prev).add(paymentId));
    try {
      await approvePayment(paymentId);
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
      await rejectPayment(paymentId);
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

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Subscription Approval</h1>
                <p className="text-gray-600">Review and approve subscription payment requests</p>
              </div>
            </div>
            
            {payments.filter(p => p.status === 'PENDING').length > 0 && (
              <Badge variant="destructive" className="flex items-center space-x-1">
                <AlertCircle className="h-4 w-4" />
                <span>{payments.filter(p => p.status === 'PENDING').length} Pending</span>
              </Badge>
            )}
          </div>

          {/* Statistics Cards */}
          <ApprovalStats payments={allPayments} />

          {/* Status Filter */}
          <Card>
            <CardHeader>
              <CardTitle>Filter by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "All Payments" },
                  { value: "PENDING", label: "Pending" },
                  { value: "APPROVED", label: "Approved" },
                  { value: "REJECTED", label: "Rejected" }
                ].map((status) => (
                  <Badge
                    key={status.value}
                    variant={selectedStatus === status.value ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedStatus(status.value)}
                  >
                    {status.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Requests ({payments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <ApprovalTable
                payments={payments}
                loading={loading}
                processingPayments={processingPayments}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewProof={handleViewProof}
              />
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
