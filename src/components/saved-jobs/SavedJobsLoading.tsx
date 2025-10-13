"use client";

import { motion } from "framer-motion";
import { Loader } from "lucide-react";

export default function SavedJobsLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-8 h-8 text-[#24CFA7]" />
      </motion.div>
    </div>
  );
}
