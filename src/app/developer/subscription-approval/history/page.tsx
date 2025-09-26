"use client";
import DeveloperAuthGuard from "@/components/auth/DeveloperAuthGuard";
import DeveloperLayout from "../../components/DeveloperLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Payment } from "../types";
import { loadPaymentHistory, filterPayments } from "../api/paymentApi";
import PaymentFilters from "../components/PaymentFilters";
import PaymentHistoryTable from "../components/PaymentHistoryTable";
import PaymentProofModal from "../components/PaymentProofModal";

export default function SubscriptionHistoryPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPaymentProof, setSelectedPaymentProof] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load all payment history
  useEffect(() => {
    loadPayments();
  }, []);

  // Filter payments when search term or filters change
  useEffect(() => {
    const filtered = filterPayments(payments, searchTerm, statusFilter);
    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const paymentData = await loadPaymentHistory();
      setPayments(paymentData);
    } catch (error) {
      // Error handling is done in the API function
    } finally {
      setLoading(false);
    }
  };

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

  // Calculate statistics
  const stats = {
    total: filteredPayments.length,
    approved: filteredPayments.filter(p => p.status === 'APPROVED').length,
    pending: filteredPayments.filter(p => p.status === 'PENDING').length,
    rejected: filteredPayments.filter(p => p.status === 'REJECTED').length,
    totalRevenue: filteredPayments
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <History className="w-4 h-4 mr-1" />
                  {filteredPayments.length} Records
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <History className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">All transactions</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approved}</div>
              <p className="text-xs text-muted-foreground">Successful payments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejected}</div>
              <p className="text-xs text-muted-foreground">Declined payments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-[#24CFA7]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From approved payments</p>
            </CardContent>
          </Card>
        </div>

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
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Payment History ({filteredPayments.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentHistoryTable
              payments={filteredPayments}
              loading={loading}
              onViewProof={handleViewPaymentProof}
            />
          </CardContent>
        </Card>

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
