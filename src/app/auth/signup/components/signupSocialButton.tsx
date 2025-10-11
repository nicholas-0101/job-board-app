"use client";
import { motion } from "framer-motion";
import { Chrome } from "lucide-react";

interface SocialLoginProps {
  handleGoogleLogin: () => void;
  isGoogleLoaded: boolean;
}

export default function SocialLoginButton({
  handleGoogleLogin,
  isGoogleLoaded,
}: SocialLoginProps) {
  return (
    <div className="w-full mt-4 sm:mt-6">
      <motion.button
        type="button"
        onClick={handleGoogleLogin}
        disabled={!isGoogleLoaded}
        className={`w-full flex items-center justify-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#F0F5F9] text-[#467EC7] font-medium transition-all cursor-pointer text-sm sm:text-base ${
          !isGoogleLoaded ? "opacity-50 cursor-not-allowed" : ""
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <img src={"/logos/google-icon.png"} className="w-5 h-5 sm:w-6 sm:h-6"/>
        Google
      </motion.button>
    </div>
  );
}
