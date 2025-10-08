"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../components/DeveloperLayout";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import { useState } from "react";
import PaymentFilters from "../components/PaymentFilters";
import PaymentHistoryTable from "../components/PaymentHistoryTable";
import PaymentProofModal from "../components/PaymentProofModal";
import HistoryStats from "../components/HistoryStats";
import { usePaymentHistory } from "../hooks/usePaymentHistory";

export default function SubscriptionHistoryPage() {
  const {
    payments,
    filteredPayments,
    loading,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter
  } = usePaymentHistory();
  
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "APPROVED": return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPlanColor = (planName: string) => {
    switch (planName) {
      case "Standard": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Professional": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
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
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      month: "short", 
      day: "numeric",
      year: "2-digit"
    });
  };

  const handleViewPaymentProof = (paymentProof: string) => {
    setSelectedPaymentProof(paymentProof);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPaymentProof(null);
  };

  return (
    <DeveloperAuthGuard>
      <DeveloperLayout>
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 rounded-lg mt-4 mb-8">
          <div className="px-6 py-8">
            <div className="flex items-start sm:items-center justify-between gap-3 flex-col sm:flex-row">
              <div className="w-full sm:w-auto text-center sm:text-left">
                <h1 className="text-3xl font-bold text-[#467EC7]">
                  Subscription History
                </h1>
                <p className="text-lg text-gray-600 mt-2">
                  Complete history of all subscription payments and transactions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <HistoryStats payments={filteredPayments} />

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg">
          <PaymentFilters
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onStatusFilterChange={setStatusFilter}
          />
        </div>

        {/* Payment History Table */}
        <div className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-lg">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Payment History ({filteredPayments.length} records)
            </h3>
            <PaymentHistoryTable
              payments={filteredPayments}
              loading={loading}
              onViewProof={handleViewPaymentProof}
            />
          </div>
        </div>

        {/* Payment Proof Modal */}
        <PaymentProofModal
          isOpen={isModalOpen}
          onClose={closeModal}
          proofUrl={selectedPaymentProof}
        />
      </DeveloperLayout>
    </DeveloperAuthGuard>
  );
}
