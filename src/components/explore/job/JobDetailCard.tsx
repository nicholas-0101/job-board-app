"use client";

import { motion } from "framer-motion";
import { useJobDetailCard } from "@/lib/hooks/useJobDetailCard";
import { isHtmlContent, convertPlainTextToHtml } from "@/lib/utils/textFormatting";
import JobDetailHeader from "./JobDetailHeader";
import PreselectionStatusBanner from "./PreselectionStatusBanner";
import JobInfoSection from "./JobInfoSection";
import JobDescription from "./JobDescription";
import JobActionButtons from "./JobActionButtons";
import JobDetailDialog from "./JobDetailDialog";
import ShareJobDialog from "./JobShareDialog";

interface JobDetailCardProps {
  job: any;
}

export default function JobDetailCard({ job }: JobDetailCardProps) {
  const {
    isAuthenticated,
    openShare,
    saved,
    dialogOpen,
    dialogTitle,
    dialogMessage,
    preselectionStatus,
    handlePretestClick,
    handleApplyClick,
    toggleSaveJob,
    handleShareClick,
    closeShare,
    closeDialog,
  } = useJobDetailCard(job);

  // Format description based on whether it's HTML or plain text
  const formattedDescription = isHtmlContent(job.description)
    ? job.description
    : convertPlainTextToHtml(job.description);

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F0F5F9] text-card-foreground rounded-2xl p-4 sm:p-6"
      >
        {/* Job Banner */}
        {job.banner && (
          <div className="mb-6 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6">
            <img
              src={job.banner}
              alt={`${job.title} banner`}
              className="w-full h-48 sm:h-64 object-cover rounded-t-2xl"
            />
          </div>
        )}

        <JobDetailHeader
          jobTitle={job.title}
          preselectionStatus={preselectionStatus}
          saved={saved}
          onPretestClick={handlePretestClick}
          onApplyClick={handleApplyClick}
          onShareClick={handleShareClick}
          onSaveClick={toggleSaveJob}
        />

        <PreselectionStatusBanner
          preselectionStatus={preselectionStatus}
          isAuthenticated={isAuthenticated ?? false}
        />

        <JobInfoSection job={job} />

        <JobDescription formattedDescription={formattedDescription} />

        <JobActionButtons
          preselectionStatus={preselectionStatus}
          saved={saved}
          onPretestClick={handlePretestClick}
          onApplyClick={handleApplyClick}
          onShareClick={handleShareClick}
          onSaveClick={toggleSaveJob}
        />
      </motion.div>

      <ShareJobDialog
        open={openShare}
        onClose={closeShare}
        job={{ title: job.title, slug: job.slug, id: job.id }}
      />

      <JobDetailDialog
        open={dialogOpen}
        onOpenChange={closeDialog}
        title={dialogTitle}
        message={dialogMessage}
        onConfirm={closeDialog}
      />
    </section>
  );
}
