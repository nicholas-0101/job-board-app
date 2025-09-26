import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

interface PaymentProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  proofUrl: string | null;
}

export default function PaymentProofModal({
  isOpen,
  onClose,
  proofUrl,
}: PaymentProofModalProps) {
  const handleDownload = () => {
    if (proofUrl) {
      const link = document.createElement('a');
      link.href = proofUrl;
      link.download = `payment-proof-${Date.now()}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Payment Proof</DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {proofUrl ? (
            <div className="flex justify-center">
              <img
                src={proofUrl}
                alt="Payment Proof"
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                        <p class="text-gray-500 mb-2">Unable to load image</p>
                        <a href="${proofUrl}" target="_blank" class="text-blue-600 hover:underline">
                          View original file
                        </a>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <p className="text-gray-500">No payment proof available</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
