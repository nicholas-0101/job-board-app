"use client";

import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function SocialMediaSection() {
  return (
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
          className="text-[#E1306C] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
        >
          <FaInstagram className="w-6 h-6" />
        </a>
        <a
          href="https://facebook.com/workoo"
          className="text-[#1877F2] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
        >
          <FaFacebook className="w-6 h-6" />
        </a>
        <a
          href="https://x.com/workoo"
          className="text-[#1DA1F2] p-4 rounded-full hover:scale-105 hover:bg-neutral-100 transition transform"
        >
          <FaTwitter className="w-6 h-6" />
        </a>
      </motion.div>
    </section>
  );
}
