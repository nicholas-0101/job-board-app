"use client";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function CompanyLoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-[#24CFA7]" />
      </motion.div>
    </div>
  );
}
