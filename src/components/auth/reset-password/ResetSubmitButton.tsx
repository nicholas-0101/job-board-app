"use client";

import { motion } from "framer-motion";

interface ResetSubmitButtonProps {
  isLoading: boolean;
}

export default function ResetSubmitButton({ isLoading }: ResetSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      className={`w-full px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all text-sm sm:text-base ${
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
          <motion.div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Resetting...
        </span>
      ) : (
        "Reset Password"
      )}
    </motion.button>
  );
}
