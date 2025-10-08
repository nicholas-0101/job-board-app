"use client";

import { motion } from "framer-motion";
import { Book, Lightbulb, Clipboard } from "lucide-react";

export default function GuidesPage() {
  const guides = [
    {
      title: "How to Optimize Your Resume",
      description:
        "Learn tips and tricks to make your resume stand out and get noticed by recruiters.",
      icon: <Clipboard className="w-10 h-10 text-[#467EC7]" />,
    },
    {
      title: "Ace Your Job Interviews",
      description:
        "Step-by-step guide to prepare and perform confidently in interviews.",
      icon: <Lightbulb className="w-10 h-10 text-[#24CFA7]" />,
    },
    {
      title: "Networking Strategies",
      description:
        "Discover the best ways to build and maintain professional connections online and offline.",
      icon: <Book className="w-10 h-10 text-[#467EC7]" />,
    },
    {
      title: "Remote Work Best Practices",
      description:
        "Maximize productivity and work-life balance while working remotely.",
      icon: <Lightbulb className="w-10 h-10 text-[#24CFA7]" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
      <section className="py-20 text-center max-w-6xl mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-[#467EC7] mb-4"
        >
          Career Guides
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mx-auto"
        >
          Explore our guides to improve your skills, get noticed by employers,
          and advance your career.
        </motion.p>
        <section className="max-w-6xl mt-20 mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {guides.map((guide, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center gap-4 md:h-50 lg:h-60">
                {guide.icon}
                <h3 className="text-xl font-semibold text-foreground">
                  {guide.title}
                </h3>
                <p className="text-muted-foreground">{guide.description}</p>
              </div>
              <button className="mt-4 px-4 py-2 bg-[#24CFA7] text-white rounded-xl font-medium hover:bg-[#24CFA7]/80 transition">
                Read Guide
              </button>
            </motion.div>
          ))}
        </section>
      </section>
    </div>
  );
}
