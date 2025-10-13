"use client";

import { motion } from "framer-motion";

interface ProfileSubmitButtonProps {
  isSaving: boolean;
}

export default function ProfileSubmitButton({ isSaving }: ProfileSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      className={`w-full mt-4 sm:mt-6 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#24cfa7] text-white font-semibold shadow-lg relative overflow-hidden group transition-all text-sm sm:text-base ${
        isSaving
          ? "cursor-not-allowed opacity-70"
          : "hover:shadow-xl cursor-pointer"
      }`}
      disabled={isSaving}
    >
      {isSaving ? "Updating..." : "Save Changes"}
    </motion.button>
  );
}
