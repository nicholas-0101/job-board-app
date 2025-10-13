"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiCall } from "@/helper/axios";

interface Payment {
  id: number;
  slug?: string;
  status: string;
  amount?: number;
  createdAt?: string;
}

export default function UserTransactionStatus() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      // Load user subscriptions then flatten payments
      const subsRes = await apiCall.get("/subscription/my-subscriptions");
      const subs = Array.isArray(subsRes.data) ? subsRes.data : [];
      const paymentLists = await Promise.all(
        subs.map((s: any) => apiCall.get(`/subscription/subscriptions/${s.id}/payments`).then(r => r.data).catch(() => []))
      );
      const flat = paymentLists.flat();
      setPayments(flat);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load transactions");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-sm text-[#A3B6CE]">No transactions found.</p>
        ) : (
          <div className="space-y-3">
            {payments.map((p) => (
              <div key={p.slug || p.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <p className="font-medium">{p.slug || `Payment #${p.id}`}</p>
                  <p className="text-xs text-[#A3B6CE]">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : "-"} · {p.amount ? `IDR ${p.amount.toLocaleString()}` : ""}
                  </p>
                </div>
                <Badge>{p.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


