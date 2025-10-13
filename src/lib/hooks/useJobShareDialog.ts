"use client";

import { useState } from "react";
import { apiCall } from "@/helper/axios";

export function useJobShareDialog() {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (jobUrl: string) => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleShare = async (platform: string, shareLinks: Record<string, string>, jobId: number) => {
    window.open(shareLinks[platform], "_blank");

    try {
      await apiCall.post(
        `/share/${jobId}`,
        { platform },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to record job share", err);
    }
  };

  return {
    message,
    copied,
    setMessage,
    handleCopyLink,
    handleShare,
  };
}
