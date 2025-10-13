"use client";

import { motion } from "framer-motion";

export default function ProfileLoading() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center text-muted-foreground"
      >
        Checking profile status...
      </motion.div>
    </section>
  );
}
