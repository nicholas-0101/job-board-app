"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SignUpLink() {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="text-center mt-6 sm:mt-8 text-sm sm:text-base text-muted-foreground"
    >
      Don't have an account?{" "}
      <Link
        href="/auth/signup"
        className="text-[#467EC7] hover:text-[#A3B6CE] font-semibold cursor-pointer"
      >
        Sign up for free
      </Link>
    </motion.p>
  );
}
