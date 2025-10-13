"use client";

import { motion } from "framer-motion";

interface ExpiredButtonProps {
  resending: boolean;
  onClick: () => void;
}

export default function ExpiredButton({ resending, onClick }: ExpiredButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all ${
        resending ? "cursor-not-allowed opacity-70" : "cursor-pointer"
      }`}
      whileHover={resending ? {} : { scale: 1.02 }}
      whileTap={resending ? {} : { scale: 0.98 }}
      disabled={resending}
    >
      {resending ? "Resending..." : "Resend Verification Email"}
    </motion.button>
  );
}
