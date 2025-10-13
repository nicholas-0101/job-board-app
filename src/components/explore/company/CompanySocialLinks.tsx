"use client";

import { FaFacebook, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";

interface CompanySocialLinksProps {
  socials: any;
}

export default function CompanySocialLinks({ socials }: CompanySocialLinksProps) {
  if (!socials) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
      <h3 className="text-sm sm:text-base text-muted-foreground">Find Us at:</h3>
      {socials.facebook && (
        <a
          href={socials.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
        >
          <FaFacebook className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      )}
      {socials.linkedin && (
        <a
          href={socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
        >
          <FaLinkedinIn className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      )}
      {socials.instagram && (
        <a
          href={socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
        >
          <FaInstagram className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      )}
      {socials.twitter && (
        <a
          href={socials.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 sm:gap-2 text-[#467EC7] hover:opacity-80 transition-colors"
        >
          <FaTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>
      )}
    </div>
  );
}
