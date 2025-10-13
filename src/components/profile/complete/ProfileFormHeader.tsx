"use client";

import { motion } from "framer-motion";

export default function ProfileFormHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
        Complete your profile
      </h1>
      <p className="text-muted-foreground">
        Please fill in your details to complete your profile
      </p>
    </motion.div>
  );
}
