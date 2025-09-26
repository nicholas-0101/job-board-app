import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Mail, Calendar, CheckCircle, XCircle, Eye, Clock } from "lucide-react";
import { Payment } from "../types";

interface PendingPaymentCardProps {
  payment: Payment;
  onApprove: (paymentId: number) => void;
  onReject: (paymentId: number) => void;
  onViewProof: (proofUrl: string) => void;
  isProcessing: boolean;
}

export default function PendingPaymentCard({
  payment,
  onApprove,
  onReject,
  onViewProof,
  isProcessing,
}: PendingPaymentCardProps) {
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

  const getDaysAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysAgo = getDaysAgo(payment.createdAt);
  const isUrgent = daysAgo > 3;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${isUrgent ? 'border-orange-200 bg-orange-50/30' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {payment.subscription.user.name || 'Unknown User'}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Mail className="h-4 w-4 mr-1" />
                    {payment.subscription.user.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>Pending</span>
                </Badge>
                {isUrgent && (
                  <Badge variant="destructive" className="text-xs">
                    {daysAgo} days ago
                  </Badge>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">Subscription Plan</span>
                <p className="text-base font-semibold text-gray-900">
                  {payment.subscription.plan.planName}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Amount</span>
                <p className="text-base font-semibold text-[#467EC7]">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Payment Method</span>
                <p className="text-base font-semibold text-gray-900">
                  {payment.paymentMethod}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                Submitted: {formatDate(payment.createdAt)}
              </div>
              
              <div className="flex items-center space-x-2">
                {payment.paymentProof && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProof(payment.paymentProof!)}
                    className="flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Proof</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(payment.id)}
                  disabled={isProcessing}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
                
                <Button
                  size="sm"
                  onClick={() => onApprove(payment.id)}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
