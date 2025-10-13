"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JobShareDialogHeaderProps {
  jobTitle: string;
}

export default function JobShareDialogHeader({ jobTitle }: JobShareDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle className="text-lg sm:text-xl font-bold text-[#467EC7]">
        Share this job
      </DialogTitle>
    </DialogHeader>
  );
}
