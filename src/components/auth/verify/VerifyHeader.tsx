"use client";

import { motion } from "framer-motion";

interface VerifyHeaderProps {
  message: string;
}

export default function VerifyHeader({ message }: VerifyHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
        Verify Account
      </h1>
      <p className="text-muted-foreground">{message}</p>
    </motion.div>
  );
}
