"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState } from "react";
import { Copy, CopyCheck } from "lucide-react";
import {
  FaLinkedinIn,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { apiCall } from "@/helper/axios";

interface ShareJobDialogProps {
  open: boolean;
  onClose: () => void;
  job: {
    title: string;
    id: number;
    slug: string;
  };
}

export default function ShareJobDialog({
  open,
  onClose,
  job,
}: ShareJobDialogProps) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const jobUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/explore/jobs/${job.slug}`;

  const shareLinks = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      jobUrl
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      jobUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(jobUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message + " " + jobUrl
    )}`,
  };

  const handleShare = async (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], "_blank");

    try {
      await apiCall.post(
        `/share/${job.id}`,
        { platform },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err) {
      console.error("Failed to record job share", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-2 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold text-[#467EC7]">
            Share this job
          </DialogTitle>
        </DialogHeader>

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-xs sm:text-sm text-muted-foreground">
            Add a custom message before sharing <strong>{job.title}</strong>.
          </p>

          {/* Animated Textarea */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write something..."
              className="focus:ring-2 focus:ring-[#467EC7]"
            />
          </motion.div>

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
                onClick={() => handleShare("linkedin")}
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
                onClick={() => handleShare("facebook")}
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
                onClick={() => handleShare("twitter")}
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
                onClick={() => handleShare("whatsapp")}
                variant={"outline"}
                className="w-full border-[#25D366] text-[#25D366] hover:text-[#25D366] rounded-lg text-xs sm:text-sm"
              >
                <FaWhatsapp className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />{" "}
                WhatsApp
              </Button>
            </motion.div>
          </motion.div>

          {/* Preview Link with Copy */}
          <motion.div
            className="flex items-center justify-between mt-3 sm:mt-4 p-2 border rounded-lg bg-[#F0F5F9]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <span className="truncate text-xs sm:text-sm text-muted-foreground max-w-50 sm:max-w-106">
              {jobUrl}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCopyLink}
            >
              {copied ? (
                <CopyCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
              ) : (
                <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-[#467EC7]" />
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
