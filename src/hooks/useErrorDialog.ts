"use client";

import { useState } from "react";

export function useErrorDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("Notice");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState<"error" | "warning" | "info" | "success">("error");

  const openDialog = (
    title: string, 
    message: string, 
    type: "error" | "warning" | "info" | "success" = "error"
  ) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const showError = (message: string, title: string = "Error") => {
    openDialog(title, message, "error");
  };

  const showWarning = (message: string, title: string = "Warning") => {
    openDialog(title, message, "warning");
  };

  const showInfo = (message: string, title: string = "Information") => {
    openDialog(title, message, "info");
  };

  const showSuccess = (message: string, title: string = "Success") => {
    openDialog(title, message, "success");
  };

  return {
    dialogOpen,
    dialogTitle,
    dialogMessage,
    dialogType,
    openDialog,
    closeDialog,
    showError,
    showWarning,
    showInfo,
    showSuccess,
  };
}
