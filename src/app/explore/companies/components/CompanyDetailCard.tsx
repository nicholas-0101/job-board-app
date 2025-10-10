"use client";

import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { Facebook, Instagram, Linkedin, Share2, Twitter } from "lucide-react";
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
        className="bg-[#F0F5F9] text-card-foreground rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-2xl font-bold text-primary shadow-sm"
            >
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-12 h-12 object-contain rounded-lg"
                />
              ) : (
                company.name?.charAt(0)
              )}
            </motion.div>
            <h1 className="text-3xl font-bold text-[#467EC7]">
              {company.name}
            </h1>
          </div>

          <div className="flex items-center gap-2">
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

        <div className="space-y-6 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-foreground" />
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#467EC7] hover:underline"
                  >
                    {company.website}
                  </a>
                ) : (
                  <span>N/A</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-foreground" />
                <span>{company.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-foreground" />
                <span>{company.phone || "N/A"}</span>
              </div>
            </div>

            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-foreground" />
                <span>{company.address || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-foreground" />
                <span>{company.locationCity || "N/A"}</span>
              </div>
            </div>
          </div>

          {company.description && (
            <div
              className="prose text-muted-foreground max-w-none mt-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(company.description),
              }}
            />
          )}
          
          {company.socials && (
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <h3 className="text-muted-foreground">Find Us at:</h3>
              {company.socials.facebook && (
                <a
                  href={company.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {company.socials.linkedin && (
                <a
                  href={company.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {company.socials.instagram && (
                <a
                  href={company.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {company.socials.twitter && (
                <a
                  href={company.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          )}
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
