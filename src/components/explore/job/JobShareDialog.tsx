"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useJobShareDialog } from "@/lib/hooks/useJobShareDialog";
import { generateJobShareLinks, generateJobUrl } from "@/lib/utils/jobShareUtils";
import JobShareDialogHeader from "./JobShareDialogHeader";
import JobShareMessageInput from "./JobShareMessageInput";
import JobSocialShareButtons from "./JobSocialShareButtons";
import JobCopyLinkSection from "./JobCopyLinkSection";

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
  const { message, copied, setMessage, handleCopyLink, handleShare } =
    useJobShareDialog();

  const jobUrl = generateJobUrl(job.slug);
  const shareLinks = generateJobShareLinks(jobUrl, message);

  const onShare = (platform: string) => {
    handleShare(platform, shareLinks, job.id);
  };

  const onCopyLink = () => {
    handleCopyLink(jobUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-2 sm:mx-0">
        <JobShareDialogHeader jobTitle={job.title} />

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <JobShareMessageInput
            message={message}
            jobTitle={job.title}
            onMessageChange={setMessage}
          />

          <JobSocialShareButtons onShare={onShare} />

          <JobCopyLinkSection
            jobUrl={jobUrl}
            copied={copied}
            onCopyLink={onCopyLink}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
