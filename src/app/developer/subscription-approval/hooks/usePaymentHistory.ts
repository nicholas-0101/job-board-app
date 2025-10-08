import { useState, useEffect } from "react";
import { Payment } from "../types";
import { loadPaymentHistory, filterPayments } from "../api/paymentApi";

export const usePaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    const filtered = filterPayments(payments, searchTerm, statusFilter);
    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter]);

  return {
    payments,
    filteredPayments,
    loading,
    searchTerm,
    statusFilter,
    setSearchTerm,
    setStatusFilter,
    loadPayments
  };
};
