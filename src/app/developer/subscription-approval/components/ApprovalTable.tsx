import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Mail, Calendar } from "lucide-react";
import { Payment } from "../types";
import ApprovalActions from "./ApprovalActions";

interface ApprovalTableProps {
  payments: Payment[];
  loading: boolean;
  processingPayments: Set<number>;
  onApprove: (paymentId: number) => void;
  onReject: (paymentId: number) => void;
  onViewProof: (proofUrl: string) => void;
}

export default function ApprovalTable({
  payments,
  loading,
  processingPayments,
  onApprove,
  onReject,
  onViewProof,
}: ApprovalTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      APPROVED: { color: "bg-green-100 text-green-800", label: "Approved" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
      EXPIRED: { color: "bg-gray-100 text-gray-800", label: "Expired" }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#467EC7]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-500">No payment requests found matching your criteria.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center">
                      <Building className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {payment.subscription.user.name || 'Unknown User'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {payment.subscription.user.email}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Plan:</span>
                    <p className="text-gray-900">{payment.subscription.plan.planName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Amount:</span>
                    <p className="text-gray-900 font-semibold">{formatCurrency(payment.amount)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Payment Method:</span>
                    <p className="text-gray-900">{payment.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created: {formatDate(payment.createdAt)}
                    {payment.approvedAt && (
                      <span className="ml-4">
                        Approved: {formatDate(payment.approvedAt)}
                      </span>
                    )}
                  </div>
                  
                  <ApprovalActions
                    paymentId={payment.id}
                    status={payment.status}
                    paymentProof={payment.paymentProof}
                    onApprove={onApprove}
                    onReject={onReject}
                    onViewProof={onViewProof}
                    isProcessing={processingPayments.has(payment.id)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
