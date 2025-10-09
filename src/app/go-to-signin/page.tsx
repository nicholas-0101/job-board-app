"use client";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function GoToSignin() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.h1
          className="text-5xl font-bold text-[#467EC7] tracking-tight flex flex-col gap-4 items-center justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.span
            className="bg-[#467EC7]/10 p-4 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <LogIn size={50} />
          </motion.span>
          Sign In
        </motion.h1>

        <motion.p
          className="mt-2 text-lg text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Please sign in to access this page
        </motion.p>

        <motion.a
          href="/auth/signin"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#24CFA7] text-white font-semibold shadow-md hover:bg-[#24CFA7]/90 transition-colors"
        >
          Sign In Now
        </motion.a>
      </motion.div>
    </motion.div>
  );
}