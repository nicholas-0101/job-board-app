import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from "lucide-react";
import { SubscriptionPlan } from "./types";

interface PaymentFormProps {
  selectedPlan: SubscriptionPlan;
  paymentMethod: string;
  paymentProof: File | null;
  isSubmitting: boolean;
  onPaymentMethodChange: (method: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

export default function PaymentForm({
  selectedPlan,
  paymentMethod,
  paymentProof,
  isSubmitting,
  onPaymentMethodChange,
  onFileUpload,
  onSubmit
}: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Choose your payment method and complete the transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="space-y-3">
            {/* Bank Transfer */}
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="radio"
                name="payment"
                value="transfer"
                checked={paymentMethod === "transfer"}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium">Bank Transfer</div>
                <div className="text-sm text-gray-600">
                  Transfer to our bank account and upload proof
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Bank Transfer Details */}
        {paymentMethod === "transfer" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <h4 className="font-semibold text-blue-900 mb-3">
              Bank Transfer Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Bank:</strong> Bank Central Asia (BCA)</p>
                <p><strong>Account:</strong> 1234567890</p>
              </div>
              <div>
                <p><strong>Name:</strong> ProHire Indonesia</p>
                <p><strong>Amount:</strong> IDR {selectedPlan.price.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upload Payment Proof */}
        {paymentMethod === "transfer" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <div>
              <Label htmlFor="paymentProof">Upload Payment Proof *</Label>
              <Input
                id="paymentProof"
                type="file"
                accept="image/*,application/pdf"
                onChange={onFileUpload}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Upload screenshot or photo of your transfer receipt (JPG, PNG, PDF - Max 5MB)
              </p>
              {paymentProof && (
                <div className="mt-2 flex items-center gap-2 text-green-600">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{paymentProof.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Transaction...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Complete Purchase - IDR {selectedPlan.price.toLocaleString()}
              </>
            )}
          </Button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <span>Processing time: 1-2 business days for manual verification</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
