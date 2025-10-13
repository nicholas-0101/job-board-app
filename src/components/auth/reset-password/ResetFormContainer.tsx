"use client";

import { motion } from "framer-motion";

interface ResetFormContainerProps {
  children: React.ReactNode;
}

export default function ResetFormContainer({ children }: ResetFormContainerProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 p-2 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-border p-4 sm:p-8 w-full max-w-md"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center text-[#467EC7]">
          Reset Password
        </h2>
        {children}
      </motion.div>
    </section>
  );
}
