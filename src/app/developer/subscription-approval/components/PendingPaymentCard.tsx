import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
} from "lucide-react";
import { Payment } from "../types";

interface PendingPaymentCardProps {
  payment: Payment;
  onApprove: (paymentSlug: string) => void; // Changed to use slug
  onReject: (paymentSlug: string) => void; // Changed to use slug
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
    <Card
      className={`hover:shadow-lg transition-all duration-200 ${
        isUrgent ? "border-orange-200 bg-orange-50/30" : ""
      }`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center">
                <Building className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                  {payment.subscription.user.name || "Unknown User"}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {payment.subscription.user.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              <Badge className="bg-yellow-100 text-yellow-800 flex items-center space-x-1 text-xs">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Subscription Plan
              </span>
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {payment.subscription.plan.planName}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Amount
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#467EC7]">
                {formatCurrency(payment.amount)}
              </p>
            </div>
            <div>
              <span className="text-xs sm:text-sm font-medium text-gray-600">
                Payment Method
              </span>
              <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {payment.paymentMethod}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs sm:text-sm text-gray-500">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
              <span className="truncate">
                Submitted: {formatDate(payment.createdAt)}
              </span>
            </div>

            <div className="flex items-center space-x-2 flex-wrap">
              {payment.paymentProof && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewProof(payment.paymentProof!)}
                  className="flex items-center space-x-1 text-xs sm:text-sm"
                >
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">View Proof</span>
                  <span className="sm:hidden">Proof</span>
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(payment.slug)}
                disabled={isProcessing}
                className="text-red-600 border-red-600 hover:bg-red-50 text-xs sm:text-sm"
              >
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Reject
              </Button>

              <Button
                size="sm"
                onClick={() => onApprove(payment.slug)}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
              >
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Approve
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
