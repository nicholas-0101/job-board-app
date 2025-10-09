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
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Current Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{subscription.plan.name}</span>
          <Badge className={getStatusColor(subscription.status)}>
            {subscription.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Expires: {formatDate(subscription.expiresAt)}
          </p>
          <p className="text-sm font-medium text-blue-600">
            {timeRemaining}
          </p>
        </div>

        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600 mb-2">Current Features:</p>
          <ul className="space-y-1">
            {subscription.plan.perks?.map((perk, index) => (
              <li key={index} className="text-sm flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                {perk}
              </li>
            )) || <li className="text-sm text-gray-500">No features available</li>}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
