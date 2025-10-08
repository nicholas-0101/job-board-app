"use client";

import { motion } from "framer-motion";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 py-20">
        <div className="max-w-6xl mx-auto text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Get in <span className="text-[#467EC7]">Touch</span> with Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Have questions, suggestions, or want to collaborate? Fill out the
            form below or reach us via social media.
          </motion.p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card border border-border rounded-2xl p-10 shadow-sm hover:shadow-md transition-all"
        >
          <form className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#467EC7]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#467EC7]"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-foreground">
                Message
              </label>
              <textarea
                placeholder="Your message..."
                rows={6}
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#467EC7]"
              />
            </div>

            <button className="w-full px-6 py-3 bg-[#24CFA7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Send Message
            </button>
          </form>
        </motion.div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-[#467EC7] mb-6"
        >
          Follow Us
        </motion.h2>
        <motion.div
          className="flex justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="https://www.instagram.com/workoo"
            className=" text-[#E1306C] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
          >
            <Instagram className="w-6 h-6" />
          </a>
          <a
            href="https://facebook.com/workoo"
            className=" text-[#1877F2] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
          >
            <Facebook className="w-6 h-6" />
          </a>
          <a
            href="https://x.com/workoo"
            className=" text-[#1DA1F2] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
          >
            <Twitter className="w-6 h-6" />
          </a>
        </motion.div>
      </section>
    </div>
  );
}
