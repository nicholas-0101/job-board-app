import { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RenewalInfo } from "../types";
import { formatDate, getTimeRemaining, getStatusColor } from "../utils";

export const CurrentSubscriptionCard = ({ 
  subscription 
}: { 
  subscription: RenewalInfo['currentSubscription'] 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    if (!subscription?.expiresAt) return;

    const updateTimer = () => {
      setTimeRemaining(getTimeRemaining(subscription.expiresAt));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [subscription?.expiresAt]);

  if (!subscription) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Plan Details */}
          <div className="flex items-center gap-4 p-4 bg-[#E1F1F3]/30 rounded-lg">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#467EC7] to-[#24CFA7]">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{subscription.plan.name} Plan</h3>
              <p className="text-sm text-[#A3B6CE]">Current subscription</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Included Features:</h4>
            <ul className="space-y-1">
              {subscription.plan.perks?.map((perk, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#24CFA7] rounded-full"></div>
                  {perk}
                </li>
              )) || <li className="text-sm text-gray-500">No features available</li>}
            </ul>
          </div>

          {/* Status & Expiry */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Status</span>
              <Badge className={getStatusColor(subscription.status)}>
                {subscription.status}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expires</span>
              <span>{formatDate(subscription.expiresAt)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Time Remaining</span>
              <span className="text-[#467EC7]">{timeRemaining}</span>
            </div>
          </div>

          {/* Renewal Info */}
          <div className="bg-[#E1F1F3]/40 p-3 rounded-lg border border-[#A3B6CE]/20">
            <p className="text-xs text-[#467EC7]">
              Renew now to continue enjoying premium features without interruption.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
