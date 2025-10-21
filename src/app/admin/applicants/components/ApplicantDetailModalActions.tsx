"use client";
import { Button } from "@/components/ui/button";

interface ApplicantDetailModalActionsProps {
  applicationId: number;
  status: string;
  onUpdateStatus: (applicationId: number, status: string) => void;
  onClose: () => void;
}

export function ApplicantDetailModalActions({
  applicationId,
  status,
  onUpdateStatus,
  onClose,
}: ApplicantDetailModalActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 pt-4 border-t">
      <Button
        onClick={() => onUpdateStatus(applicationId, "INTERVIEW")}
        className="bg-purple-100 text-purple-700 hover:bg-purple-200"
        disabled={status === "INTERVIEW"}
      >
        Schedule Interview
      </Button>
      <Button
        onClick={() => onUpdateStatus(applicationId, "ACCEPTED")}
        className="bg-green-100 text-green-700 hover:bg-green-200"
        disabled={status === "ACCEPTED"}
      >
        Accept Application
      </Button>
      <Button
        onClick={() => onUpdateStatus(applicationId, "REJECTED")}
        variant="destructive"
        disabled={status === "REJECTED"}
      >
        Reject Application
      </Button>
      <Button variant="outline" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
