"use client";

import { motion } from "framer-motion";
import { Copy, CopyCheck } from "lucide-react";

interface CopyLinkSectionProps {
  companyUrl: string;
  copied: boolean;
  onCopyLink: () => void;
}

export default function CopyLinkSection({
  companyUrl,
  copied,
  onCopyLink,
}: CopyLinkSectionProps) {
  return (
    <motion.div
      className="flex items-center justify-between mt-3 sm:mt-4 p-2 border rounded-lg bg-[#F0F5F9]"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
    >
      <span className="truncate text-xs sm:text-sm text-muted-foreground max-w-50 sm:max-w-106">
        {companyUrl}
      </span>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onCopyLink}
      >
        {copied ? (
          <CopyCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
        ) : (
          <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
        )}
      </motion.button>
    </motion.div>
  );
}
