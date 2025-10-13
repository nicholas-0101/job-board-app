"use client";

import { motion } from "framer-motion";

interface VerifyButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export default function VerifyButton({ isLoading, onClick }: VerifyButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all ${
        isLoading
          ? "cursor-not-allowed opacity-70"
          : "hover:shadow-xl cursor-pointer"
      }`}
      whileHover={isLoading ? {} : { scale: 1.02 }}
      whileTap={isLoading ? {} : { scale: 0.98 }}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Verifying...
        </span>
      ) : (
        "Verify"
      )}
    </motion.button>
  );
}
