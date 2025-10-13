import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Building, Mail, Calendar } from "lucide-react";
import { Payment } from "../types";

interface PaymentHistoryTableProps {
  payments: Payment[];
  loading: boolean;
  onViewProof: (proofUrl: string) => void;
}

export default function PaymentHistoryTable({
  payments,
  loading,
  onViewProof,
}: PaymentHistoryTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      APPROVED: { color: "bg-green-100 text-green-800", label: "Approved" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
      EXPIRED: { color: "bg-gray-100 text-gray-800", label: "Expired" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

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

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-24 sm:h-32">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#467EC7]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="text-center py-6 sm:py-8">
            <Building className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No Payment History
            </h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              No payment records found matching your criteria.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center flex-shrink-0">
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
                <div className="flex-shrink-0">
                  {getStatusBadge(payment.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-medium text-gray-700">Plan:</span>
                  <p className="text-gray-900 truncate">
                    {payment.subscription.plan.planName}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <p className="text-gray-900 font-semibold">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Payment Method:
                  </span>
                  <p className="text-gray-900 truncate">
                    {payment.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-0">
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      Created: {formatDate(payment.createdAt)}
                    </span>
                  </div>
                  {payment.approvedAt && (
                    <div className="flex items-center sm:ml-4">
                      <span className="truncate">
                        Approved: {formatDate(payment.approvedAt)}
                      </span>
                    </div>
                  )}
                </div>

                {payment.paymentProof && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewProof(payment.paymentProof!)}
                    className="flex items-center space-x-1 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>View Proof</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
