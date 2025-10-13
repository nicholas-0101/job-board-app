"use client";

import { motion } from "framer-motion";

interface SuccessButtonProps {
  onClick: () => void;
}

export default function SuccessButton({ onClick }: SuccessButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="w-full px-6 py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      Continue
    </motion.button>
  );
}
