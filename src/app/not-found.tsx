"use client";

import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="text-center max-w-md"
        initial={{ y: 30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          ease: "easeOut",
        }}
      >
        <motion.h1
          className="text-6xl font-bold text-[#467EC7] tracking-tight"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 12 }}
        >
          404
        </motion.h1>

        <motion.p
          className="mt-2 text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Page not found
        </motion.p>

        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        <motion.a
          href="/"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#24CFA7] text-primary-foreground font-semibold hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          Go Home
        </motion.a>
      </motion.div>
    </motion.div>
  );
}