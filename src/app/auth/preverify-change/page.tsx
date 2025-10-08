"use client";
import { motion } from "framer-motion";

export default function PreVerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-8 text-center grid gap-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold text-[#467EC7] mb-2">
              Email Changed!
            </h1>
            <p className="text-muted-foreground">
              Your email address has been changed. Please check your email to
              verify.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
