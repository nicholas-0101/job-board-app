"use client";

import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader className="w-8 h-8 text-[#24CFA7]" />
      </motion.div>
    </div>
  );
}
