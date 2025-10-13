"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  FaLinkedinIn,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

interface JobSocialShareButtonsProps {
  onShare: (platform: string) => void;
}

export default function JobSocialShareButtons({ onShare }: JobSocialShareButtonsProps) {
  return (
    <>
      {/* Animated Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between gap-2 mt-3 sm:mt-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1"
        >
          <Button
            onClick={() => onShare("linkedin")}
            variant={"outline"}
            className="w-full border-[#0A66C2] text-[#0A66C2] hover:text-[#0A66C2] rounded-lg text-xs sm:text-sm"
          >
            <FaLinkedinIn className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />{" "}
            LinkedIn
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1"
        >
          <Button
            onClick={() => onShare("facebook")}
            variant={"outline"}
            className="w-full border-[#1877F2] text-[#1877F2] hover:text-[#1877F2] rounded-lg text-xs sm:text-sm"
          >
            <FaFacebook className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />{" "}
            Facebook
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row justify-between gap-2 mt-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1"
        >
          <Button
            onClick={() => onShare("twitter")}
            variant={"outline"}
            className="w-full border-[#1DA1F2] text-[#1DA1F2] hover:text-[#1DA1F2] rounded-lg text-xs sm:text-sm"
          >
            <FaTwitter className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />{" "}
            Twitter
          </Button>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1"
        >
          <Button
            onClick={() => onShare("whatsapp")}
            variant={"outline"}
            className="w-full border-[#25D366] text-[#25D366] hover:text-[#25D366] rounded-lg text-xs sm:text-sm"
          >
            <FaWhatsapp className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />{" "}
            WhatsApp
          </Button>
        </motion.div>
      </motion.div>
    </>
  );
}
