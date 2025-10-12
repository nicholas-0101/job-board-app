import { useState } from "react";
import { Upload, FileText, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { RenewalInfo } from "../types";
import { formatCurrency, formatDate } from "../utils";

export const PendingPaymentCard = ({ 
  pendingPayment, 
  onUploadProof 
}: {
  pendingPayment: RenewalInfo['pendingPayment'];
  onUploadProof: (file: File) => Promise<void>;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        await onUploadProof(selectedFile);
      } finally {
        setIsUploading(false);
        setSelectedFile(null);
      }
    }
  };

  if (!pendingPayment) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
        <CardDescription>
          Complete your renewal by uploading payment proof
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Status */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 border-2 border-[#A3B6CE]/30 rounded-xl">
              <div className="flex-1">
                <div className="font-medium">Pending Payment</div>
                <div className="text-sm text-gray-600">
                  Amount: {formatCurrency(pendingPayment.amount)}
                </div>
                <div className="text-sm text-gray-600">
                  Expires: {formatDate(pendingPayment.expiresAt)}
                </div>
              </div>
              <Badge className="bg-[#E1F1F3] text-[#467EC7] border border-[#A3B6CE]/30">
                {pendingPayment.status}
              </Badge>
            </div>
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
              <p><strong>Amount:</strong> {formatCurrency(pendingPayment.amount)}</p>
            </div>
          </div>
        </motion.div>

        {/* Upload Payment Proof */}
        {!pendingPayment.paymentProof ? (
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
                onChange={handleFileSelect}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">
                Upload screenshot or photo of your transfer receipt (JPG, PNG, PDF - Max 5MB)
              </p>
              {selectedFile && (
                <div className="mt-2 flex items-center gap-2 text-[#24CFA7]">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">{selectedFile.name}</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="bg-[#E1F1F3]/50 border border-[#24CFA7]/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-[#24CFA7] mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Payment proof uploaded</span>
            </div>
            <p className="text-xs text-[#A3B6CE]">
              Waiting for developer approval. You will receive an email notification once approved.
            </p>
          </div>
        )}

        {/* Submit Button */}
        {!pendingPayment.paymentProof && (
          <div className="pt-4">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-[#24CFA7] hover:bg-[#24CFA7]/90 text-white py-3 text-lg"
              size="lg"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading Payment Proof...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Payment Proof
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
        )}
      </CardContent>
    </Card>
  );
};
