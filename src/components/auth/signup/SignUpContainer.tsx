"use client";

import { motion } from "framer-motion";

interface SignUpContainerProps {
  children: React.ReactNode;
}

export default function SignUpContainer({ children }: SignUpContainerProps) {
  return (
    <section className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 flex items-center justify-center p-2 sm:p-4 pb-12 sm:pb-20 pt-8 sm:pt-10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {children}
      </motion.div>
    </section>
  );
}
