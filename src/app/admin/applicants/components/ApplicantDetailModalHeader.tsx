"use client";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ApplicantDetail } from "./ApplicantDetailModal";

interface ApplicantDetailModalHeaderProps {
  applicant: ApplicantDetail;
}

export function ApplicantDetailModalHeader({ applicant }: ApplicantDetailModalHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-3">
        <img
          src={applicant.profilePicture || "/fallback_pfp_image.jpg"}
          alt={applicant.userName}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
        />
        <div>
          <h2 className="text-xl font-semibold">{applicant.userName}</h2>
          <p className="text-sm text-muted-foreground">{applicant.userEmail}</p>
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}
