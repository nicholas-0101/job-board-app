"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useShareDialog } from "@/lib/hooks/useShareDialog";
import { generateShareLinks, generateCompanyUrl } from "@/lib/utils/shareUtils";
import ShareDialogHeader from "./ShareDialogHeader";
import ShareMessageInput from "./ShareMessageInput";
import SocialShareButtons from "./SocialShareButtons";
import CopyLinkSection from "./CopyLinkSection";

interface ShareCompanyDialogProps {
  open: boolean;
  onClose: () => void;
  company: {
    name: string;
    slug: string;
  };
}

export default function ShareCompanyDialog({
  open,
  onClose,
  company,
}: ShareCompanyDialogProps) {
  const { message, copied, setMessage, handleCopyLink, handleShare } =
    useShareDialog();

  const companyUrl = generateCompanyUrl(company.slug);
  const shareLinks = generateShareLinks(companyUrl, message);

  const onShare = (platform: string) => {
    handleShare(platform, shareLinks);
  };

  const onCopyLink = () => {
    handleCopyLink(companyUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="mx-2 sm:mx-0">
        <ShareDialogHeader companyName={company.name} />

        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ShareMessageInput
            message={message}
            companyName={company.name}
            onMessageChange={setMessage}
          />

          <SocialShareButtons onShare={onShare} />

          <CopyLinkSection
            companyUrl={companyUrl}
            copied={copied}
            onCopyLink={onCopyLink}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
