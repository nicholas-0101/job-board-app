"use client";

import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { Share2 } from "lucide-react";
import { Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";

interface CompanyDetailCardProps {
  company: any;
}

export default function CompanyDetailCard({ company }: CompanyDetailCardProps) {
  return (
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
          <h1 className="text-3xl font-bold text-[#467EC7]">{company.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-sm font-medium transition-colors cursor-pointer">
            Review
          </button>
          <button className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4 text-foreground" />
          <span>{company.email || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4 text-foreground" />
          <span>{company.phone || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 text-foreground" />
          <span>{company.address || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Building2 className="w-4 h-4 text-foreground" />
          <span>{company.locationCity || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
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
      </div>

      {company.description && (
        <div
          className="prose text-muted-foreground max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(company.description),
          }}
        />
      )}
    </motion.div>
  );
}
