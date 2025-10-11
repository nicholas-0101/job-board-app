"use client";

import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import {  Share2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";
import { Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";
import ShareCompanyDialog from "./CompanyShareDialog";
import CreateReviewDialog from "./CreateReviewDialog";
import EmploymentEligibility from "./EmploymentEligibility";
import { useState } from "react";

interface CompanyDetailCardProps {
  company: any;
  onReviewSubmitted?: () => void;
}

export default function CompanyDetailCard({
  company,
  onReviewSubmitted,
}: CompanyDetailCardProps) {
  const [openShare, setOpenShare] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [isEligibleToReview, setIsEligibleToReview] = useState(false);
  const [userEmployment, setUserEmployment] = useState<any>(null);

  const handleEligibilityCheck = (isEligible: boolean, employment?: any) => {
    setIsEligibleToReview(isEligible);
    setUserEmployment(employment);
  };

  const handleReviewClick = () => {
    if (isEligibleToReview) {
      setOpenReview(true);
    }
  };

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F0F5F9] text-card-foreground rounded-2xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-primary shadow-sm flex-shrink-0"
            >
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg flex-shrink-0"
                />
              ) : (
                company.name?.charAt(0)
              )}
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#467EC7]">
              {company.name}
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleReviewClick}
              disabled={!isEligibleToReview}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEligibleToReview
                  ? "bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 cursor-pointer"
                  : "bg-[#24CFA7]/60 text-white cursor-not-allowed"
              }`}
            >
              Review
            </button>
            <button
              className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
              onClick={() => setOpenShare(true)}
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-foreground" />
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#467EC7] hover:underline text-sm sm:text-base"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span className="text-sm sm:text-base">N/A</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-foreground" />
                <span className="text-sm sm:text-base">{company.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-foreground" />
                <span className="text-sm sm:text-base">{company.phone || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-foreground" />
                <span className="text-sm sm:text-base">{company.address || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-foreground" />
                <span className="text-sm sm:text-base">{company.locationCity || "N/A"}</span>
              </div>
            </div>
          </div>

          {company.description && (
            <div
              className="prose prose-sm sm:prose-base text-muted-foreground max-w-none mt-3 sm:mt-4
                         prose-headings:text-foreground prose-headings:font-semibold prose-headings:mt-3 sm:prose-headings:mt-4 prose-headings:mb-2 sm:prose-headings:mb-3
                         prose-h1:text-xl sm:prose-h1:text-2xl prose-h1:text-foreground prose-h1:font-bold prose-h1:mb-2 sm:prose-h1:mb-3
                         prose-h2:text-lg sm:prose-h2:text-xl prose-h2:text-foreground prose-h2:font-bold prose-h2:mb-2 sm:prose-h2:mb-3
                         prose-h3:text-base sm:prose-h3:text-lg prose-h3:text-foreground prose-h3:font-semibold prose-h3:mb-2 sm:prose-h3:mb-3
                         prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-2 sm:prose-p:mb-3 prose-p:text-sm sm:prose-p:text-base
                         prose-ul:text-muted-foreground prose-ul:mb-2 sm:prose-ul:mb-3 prose-ul:list-disc prose-ul:pl-4 sm:prose-ul:pl-6
                         prose-ol:text-muted-foreground prose-ol:mb-2 sm:prose-ol:mb-3 prose-ol:list-decimal prose-ol:pl-4 sm:prose-ol:pl-6
                         prose-li:text-muted-foreground prose-li:mb-1 sm:prose-li:mb-2 prose-li:text-sm sm:prose-li:text-base
                         prose-strong:text-foreground prose-strong:font-semibold
                         prose-em:text-foreground prose-em:italic
                         prose-a:text-[#467EC7] prose-a:underline prose-a:hover:text-[#24CFA7]
                         prose-blockquote:border-l-4 prose-blockquote:border-[#24CFA7] prose-blockquote:pl-3 sm:prose-blockquote:pl-4 prose-blockquote:italic
                         prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(company.description),
              }}
            />
          )}
          
          {company.socials && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <h3 className="text-sm sm:text-base text-muted-foreground">Find Us at:</h3>
              {company.socials.facebook && (
                <a
                  href={company.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {company.socials.linkedin && (
                <a
                  href={company.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <FaLinkedinIn className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {company.socials.instagram && (
                <a
                  href={company.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
              {company.socials.twitter && (
                <a
                  href={company.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Mobile Action Buttons - Bottom of Card */}
        <div className="flex sm:hidden items-center justify-between gap-2 mt-6 pt-4 border-t border-border">
          <button
            onClick={handleReviewClick}
            disabled={!isEligibleToReview}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              isEligibleToReview
                ? "bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 cursor-pointer"
                : "bg-[#24CFA7]/60 text-white cursor-not-allowed"
            }`}
          >
            Review
          </button>
          <button
            className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
            onClick={() => setOpenShare(true)}
          >
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </motion.div>

      {/* Employment Eligibility Check */}
      <EmploymentEligibility
        companyId={company.id}
        onEligibilityCheck={handleEligibilityCheck}
      />
      <ShareCompanyDialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        company={company}
      />
      <CreateReviewDialog
        open={openReview}
        onClose={() => setOpenReview(false)}
        company={company}
        onReviewSubmitted={onReviewSubmitted}
        userEmployment={userEmployment}
      />
    </section>
  );
}
