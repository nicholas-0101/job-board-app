import { useState } from "react";
import { Upload, FileText, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-orange-600" />
          Pending Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">Amount</span>
          <span className="text-lg font-bold text-orange-600">
            {formatCurrency(pendingPayment.amount)}
          </span>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Payment expires: {formatDate(pendingPayment.expiresAt)}
          </p>
          <Badge className="bg-orange-100 text-orange-800">
            {pendingPayment.status}
          </Badge>
        </div>

        {!pendingPayment.paymentProof ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Please upload your payment proof to complete the renewal.
            </p>
            
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-orange-300 rounded-lg cursor-pointer hover:border-orange-400"
              >
                <Upload className="w-5 h-5 mr-2 text-orange-600" />
                <span className="text-sm text-orange-600">
                  {selectedFile ? selectedFile.name : "Choose payment proof"}
                </span>
              </label>
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Payment Proof
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-green-600">
              ✓ Payment proof uploaded. Waiting for developer approval.
            </p>
            <p className="text-xs text-gray-500">
              You will receive an email notification once approved.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
