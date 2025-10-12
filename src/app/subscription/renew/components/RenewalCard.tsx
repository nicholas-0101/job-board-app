import { RefreshCw, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
  <Card>
    <CardHeader>
      <CardTitle>Renewal Information</CardTitle>
      <CardDescription>
        Choose your renewal method and complete the transaction
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Renewal Method */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Renewal Method</h3>
        <div className="space-y-3">
          {/* Bank Transfer */}
          <label className="flex items-center gap-3 p-4 border-2 border-[#A3B6CE]/30 rounded-xl cursor-pointer hover:border-[#467EC7] transition-colors">
            <input
              type="radio"
              name="renewal"
              value="transfer"
              checked={true}
              readOnly
              className="w-4 h-4 text-[#467EC7]"
            />
            <div className="flex-1">
              <div className="font-medium">Bank Transfer</div>
              <div className="text-sm text-gray-600">
                Transfer to our bank account for renewal
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Bank Transfer Details */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-[#E1F1F3]/50 border border-[#A3B6CE]/30 rounded-lg p-4"
      >
        <h4 className="font-semibold text-[#467EC7] mb-3">
          Bank Transfer Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Bank:</strong> Bank Central Asia (BCA)</p>
            <p><strong>Account:</strong> 1234567890</p>
          </div>
          <div>
            <p><strong>Name:</strong> PT. Workoo Job</p>
            <p><strong>Amount:</strong> {formatCurrency(renewalInfo.renewalPrice)}</p>
          </div>
        </div>
      </motion.div>

      {/* Renewal Information */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          <strong>Plan:</strong> {renewalInfo.plan?.name}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Duration:</strong> Extend for another 1 hour
        </p>
        <p className="text-sm text-gray-600">
          <strong>Reminder:</strong> You will receive a reminder 50 minutes before expiry
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          onClick={onRenew}
          disabled={isRenewing}
          className="w-full bg-[#24CFA7] hover:bg-[#24CFA7]/90 text-white py-3 text-lg"
          size="lg"
        >
          {isRenewing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Renewal...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Complete Renewal - {formatCurrency(renewalInfo.renewalPrice)}
            </>
          )}
        </Button>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#A3B6CE]">
          <div className="w-4 h-4 rounded-full border-2 border-[#A3B6CE] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#A3B6CE] rounded-full animate-pulse"></div>
          </div>
          <span>Processing time: 1-2 business days for manual verification</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
