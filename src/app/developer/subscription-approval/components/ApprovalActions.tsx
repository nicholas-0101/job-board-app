import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye } from "lucide-react";

interface ApprovalActionsProps {
  paymentId: number;
  status: string;
  paymentProof?: string;
  onApprove: (paymentId: number) => void;
  onReject: (paymentId: number) => void;
  onViewProof: (proofUrl: string) => void;
  isProcessing: boolean;
}

export default function ApprovalActions({
  paymentId,
  status,
  paymentProof,
  onApprove,
  onReject,
  onViewProof,
  isProcessing,
}: ApprovalActionsProps) {
  if (status !== 'PENDING') {
    return (
      <div className="flex items-center space-x-2">
        {paymentProof && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProof(paymentProof)}
            className="flex items-center space-x-1"
          >
            <Eye className="h-4 w-4" />
            <span>View Proof</span>
          </Button>
        )}
        <span className="text-sm text-gray-500">
          {status === 'APPROVED' ? 'Already approved' : 'Already rejected'}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {paymentProof && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProof(paymentProof)}
          className="flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View Proof</span>
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onApprove(paymentId)}
        disabled={isProcessing}
        className="text-green-600 border-green-600 hover:bg-green-50"
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Approve
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onReject(paymentId)}
        disabled={isProcessing}
        className="text-red-600 border-red-600 hover:bg-red-50"
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
}
