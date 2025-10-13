"use client";

import { useState } from "react";

export function useProfileDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Notice");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAction, setDialogAction] = useState<(() => void) | null>(null);

  const openDialog = (title: string, message: string, action?: () => void) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogAction(() => action || null);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    dialogAction?.();
  };

  return {
    dialogOpen,
    dialogTitle,
    dialogMessage,
    dialogAction,
    openDialog,
    closeDialog,
    setDialogOpen,
  };
}
