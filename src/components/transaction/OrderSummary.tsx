import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlan } from "./types";

interface OrderSummaryProps {
  selectedPlan: SubscriptionPlan;
}

export default function OrderSummary({ selectedPlan }: OrderSummaryProps) {
  const IconComponent = selectedPlan.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Plan Details */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${selectedPlan.color}`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{selectedPlan.name} Plan</h3>
              <p className="text-sm text-gray-600">Monthly subscription</p>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Included Features:</h4>
            <ul className="space-y-1">
              {selectedPlan.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Price Breakdown */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>IDR {selectedPlan.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span>IDR 0</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>IDR {selectedPlan.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Billing Info */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800">
              You will be charged IDR {selectedPlan.price.toLocaleString()} monthly. 
              Cancel anytime from your account settings.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
