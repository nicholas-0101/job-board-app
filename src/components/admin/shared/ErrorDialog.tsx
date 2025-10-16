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
import { AlertTriangle, X, CheckCircle, Info } from "lucide-react";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  message: string;
  type?: "error" | "warning" | "info" | "success";
  onConfirm: () => void;
}

export default function ErrorDialog({
  open,
  onOpenChange,
  title,
  message,
  type = "error",
  onConfirm,
}: ErrorDialogProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "error":
        return <X className="w-6 h-6 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      case "warning":
        return "text-yellow-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md !rounded-3xl mx-2 sm:mx-0">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {getIcon()}
            <DialogTitle className={`text-xl sm:text-2xl ${getTitleColor()}`}>
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base sm:text-lg text-muted-foreground whitespace-pre-line">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={onConfirm}
            className="bg-[#24CFA7] hover:bg-[#24CFA7]/80 text-white rounded-lg text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2"
          >
            OK
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
