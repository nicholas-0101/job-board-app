"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ShareDialogHeaderProps {
  companyName: string;
}

export default function ShareDialogHeader({ companyName }: ShareDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="text-lg sm:text-xl font-bold text-[#467EC7]">
        Share this company
      </DialogTitle>
    </DialogHeader>
  );
}
