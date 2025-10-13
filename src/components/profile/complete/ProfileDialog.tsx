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

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  onAction?: () => void;
}

export default function ProfileDialog({
  open,
  onOpenChange,
  title,
  message,
  onAction,
}: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md !rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#467EC7]">
            {title}
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={() => {
              onOpenChange(false);
              onAction?.();
            }}
            className="bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white rounded-lg"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
