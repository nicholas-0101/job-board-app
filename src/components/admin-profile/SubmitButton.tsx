"use client";

import { motion } from "framer-motion";

interface SubmitButtonProps {
  isSaving: boolean;
}

export default function SubmitButton({ isSaving }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      whileHover={!isSaving ? { scale: 1.02 } : {}}
      whileTap={!isSaving ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      disabled={isSaving}
      className={`w-full mt-8 px-6 py-3 rounded-xl font-semibold text-white shadow-lg transition-all 
      ${
        isSaving
          ? "bg-[#24cfa7]/80 cursor-not-allowed"
          : "bg-[#24cfa7] hover:bg-[#24cfa7]/80 cursor-pointer"
      }`}
    >
      {isSaving ? "Updating..." : "Save Changes"}
    </motion.button>
  );
}
