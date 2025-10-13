"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiCall } from "@/helper/axios";

interface Subscription {
  id: number;
  status: string;
  startedAt?: string;
  expiresAt?: string;
  plan?: { name?: string; price?: number; perks?: string[] };
}

export default function UserSubscriptionStatus() {
  const [current, setCurrent] = useState<Subscription | null>(null);
  const [history, setHistory] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const [activeRes, allRes] = await Promise.all([
        apiCall.get("/subscription/my-active-subscription"),
        apiCall.get("/subscription/my-subscriptions"),
      ]);
      setCurrent(activeRes.data || null);
      setHistory(Array.isArray(allRes.data) ? allRes.data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to load subscription status");
      setCurrent(null);
      setHistory([]);
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
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
        </CardHeader>
        <CardContent>
          {current ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="font-medium">{current.plan?.name || "Plan"}</p>
                <p className="text-sm text-[#A3B6CE]">
                  Expires: {current.expiresAt ? new Date(current.expiresAt).toLocaleString() : "-"}
                </p>
              </div>
              <Badge>{current.status}</Badge>
            </div>
          ) : (
            <p className="text-sm text-[#A3B6CE]">You do not have an active subscription.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-sm text-[#A3B6CE]">No past subscriptions.</p>
          ) : (
            <div className="space-y-3">
              {history.map((s) => (
                <div key={s.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <p className="font-medium">{s.plan?.name || `Subscription #${s.id}`}</p>
                    <p className="text-xs text-[#A3B6CE]">
                      {s.startedAt ? new Date(s.startedAt).toLocaleDateString() : "-"} → {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString() : "-"}
                    </p>
                  </div>
                  <Badge>{s.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


