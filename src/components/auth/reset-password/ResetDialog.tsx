"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onConfirm: () => void;
}

export default function ResetDialog({
  open,
  onOpenChange,
  title,
  message,
  onConfirm,
}: ResetDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md !rounded-3xl mx-2 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl text-[#467EC7]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base sm:text-lg text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onConfirm}
            className="bg-[#24CFA7] hover:bg-bg-[#24CFA7]/80 text-white rounded-lg text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
