"use client";

import { motion } from "framer-motion";
import { useCompanyDetailCard } from "@/lib/hooks/useCompanyDetailCard";
import CompanyHeader from "./CompanyHeader";
import CompanyInfo from "./CompanyInfo";
import CompanyDescription from "./CompanyDescription";
import CompanySocialLinks from "./CompanySocialLinks";
import CompanyActionButtons from "./CompanyActionButtons";
import ShareCompanyDialog from "./CompanyShareDialog";
import CreateReviewDialog from "./CreateReviewDialog";
import EmploymentEligibility from "./EmploymentEligibility";

interface CompanyDetailCardProps {
  company: any;
  onReviewSubmitted?: () => void;
}

export default function CompanyDetailCard({
  company,
  onReviewSubmitted,
}: CompanyDetailCardProps) {
  const {
    openShare,
    openReview,
    isEligibleToReview,
    userEmployment,
    handleEligibilityCheck,
    handleReviewClick,
    handleShareClick,
    closeShare,
    closeReview,
  } = useCompanyDetailCard();

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F0F5F9] text-card-foreground rounded-2xl p-4 sm:p-6"
      >
        <CompanyHeader
          company={company}
          isEligibleToReview={isEligibleToReview}
          onReviewClick={handleReviewClick}
          onShareClick={handleShareClick}
        />

        <div className="space-y-4 sm:space-y-6 mb-4">
          <CompanyInfo company={company} />
          
          <CompanyDescription description={company.description} />
          
          <CompanySocialLinks socials={company.socials} />
        </div>

        <CompanyActionButtons
          isEligibleToReview={isEligibleToReview}
          onReviewClick={handleReviewClick}
          onShareClick={handleShareClick}
        />
      </motion.div>

      {/* Employment Eligibility Check */}
      <EmploymentEligibility
        companyId={company.id}
        onEligibilityCheck={handleEligibilityCheck}
      />
      <ShareCompanyDialog
        open={openShare}
        onClose={closeShare}
        company={company}
      />
      <CreateReviewDialog
        open={openReview}
        onClose={closeReview}
        company={company}
        onReviewSubmitted={onReviewSubmitted}
        userEmployment={userEmployment}
      />
    </section>
  );
}
