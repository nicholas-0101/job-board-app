"use client";

import { useState } from "react";

export function useShareDialog() {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async (companyUrl: string) => {
    try {
      await navigator.clipboard.writeText(companyUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleShare = (platform: string, shareLinks: Record<string, string>) => {
    window.open(shareLinks[platform], "_blank");
  };

  return {
    message,
    copied,
    setMessage,
    handleCopyLink,
    handleShare,
  };
}
