"use client";

import { motion } from "framer-motion";

export default function ContactHero() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-[#467EC7] mb-4"
        >
          Get in <span className="text-[#24CFA7]">Touch</span> with Us
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Have questions, suggestions, or want to collaborate? Fill out the form below or reach us via social media.
        </motion.p>
      </div>
    </section>
  );
}
