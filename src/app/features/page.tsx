"use client";

import { motion } from "framer-motion";
import { Rocket, Users, MessageCircle, SearchIcon } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Job Matching",
      description:
        "Our algorithm connects professionals with opportunities that perfectly fit their skills and goals.",
      icon: <SearchIcon className="w-10 h-10 text-[#467EC7]" />,
    },
    {
      title: "Collaborative Network",
      description:
        "Workoo fosters a vibrant community where users can share ideas, tips, and collaborate on career growth.",
      icon: <Users className="w-10 h-10 text-[#24CFA7]" />,
    },
    {
      title: "Fast & Secure Applications",
      description:
        "Apply to jobs in a few clicks while ensuring your data is encrypted and protected at all times.",
      icon: <Rocket className="w-10 h-10 text-[#467EC7]" />,
    },
    {
      title: "Real-time Support",
      description:
        "Our responsive support team is always ready to help you with any questions or guidance you need.",
      icon: <MessageCircle className="w-10 h-10 text-[#24CFA7]" />,
    },
  ];

  return (
    <section className="py-25 bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-[#467EC7]"
        >
          Why Choose Workoo
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-muted-foreground max-w-2xl mx-auto mt-4"
        >
          Workoo is designed to make your career journey smoother, smarter, and more connected.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className="bg-card border border-border rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col items-center gap-4">
              {feature.icon}
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}