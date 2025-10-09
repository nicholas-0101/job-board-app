import { RefreshCw, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RenewalInfo } from "../types";
import { formatCurrency } from "../utils";

export const RenewalCard = ({ 
  renewalInfo, 
  onRenew, 
  isRenewing 
}: {
  renewalInfo: RenewalInfo;
  onRenew: () => void;
  isRenewing: boolean;
}) => (
  <Card className="border-green-200 bg-green-50">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-green-600" />
        Renewal Options
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Renew {renewalInfo.plan?.name}</span>
        <span className="text-lg font-bold text-green-600">
          {formatCurrency(renewalInfo.renewalPrice)}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Extend your subscription for another 3 minutes (testing mode)
        </p>
        <p className="text-xs text-gray-500">
          Production: 30 days extension
        </p>
      </div>

      <Button 
        onClick={onRenew}
        disabled={isRenewing}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        {isRenewing ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Renew Subscription
          </>
        )}
      </Button>
    </CardContent>
  </Card>
);
