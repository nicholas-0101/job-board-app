"use client";

import { Mail, Phone, MapPin, Globe, Building2 } from "lucide-react";

interface CompanyInfoProps {
  company: any;
}

export default function CompanyInfo({ company }: CompanyInfoProps) {
  return (
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
  );
}
