"use client";
import { motion } from "framer-motion";

interface HeaderProps {
  tab: "seeker" | "admin";
}

export default function Header({ tab }: HeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-8"
    >
      <h1 className="text-3xl font-bold text-[#467EC7] mb-2">Create Account</h1>
      <p className="text-muted-foreground">
        {tab === "seeker"
          ? "Create account to find your dream career"
          : "Create account to own your dream company"}
      </p>
    </motion.div>
  );
}