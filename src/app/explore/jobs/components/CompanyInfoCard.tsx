"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";
import DOMPurify from "dompurify";

interface CompanyInfoCardProps {
  company: {
    name: string;
    logo?: string;
    email?: string;
    phone?: string;
    address?: string;
    locationCity?: string;
    website?: string;
    description?: string;
  };
}

export default function CompanyInfoCard({ company }: CompanyInfoCardProps) {
  if (!company) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-[#E1F1F3] rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold text-[#467EC7] mb-6">
        About the company
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
        <div className="space-y-3">
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

        <div className="space-y-3">
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
          className="prose text-muted-foreground mt-6 max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(company.description),
          }}
        />
      )}
    </motion.div>
  );
}
