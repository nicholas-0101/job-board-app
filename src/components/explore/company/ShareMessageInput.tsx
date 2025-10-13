"use client";

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

interface ShareMessageInputProps {
  message: string;
  companyName: string;
  onMessageChange: (message: string) => void;
}

export default function ShareMessageInput({
  message,
  companyName,
  onMessageChange,
}: ShareMessageInputProps) {
  return (
    <>
      <p className="text-xs sm:text-sm text-muted-foreground">
        Add a custom message before sharing <strong>{companyName}</strong>.
      </p>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Write something..."
          className="focus:ring-2 focus:ring-[#467EC7]"
        />
      </motion.div>
    </>
  );
}
