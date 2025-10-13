"use client";

import { motion } from "framer-motion";

export default function SignInHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-6 sm:mb-8"
    >
      <h1 className="text-2xl sm:text-3xl font-bold text-[#467EC7] mb-2">
        Welcome back!
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground px-4">
        Sign in to access your account
      </p>
    </motion.div>
  );
}
