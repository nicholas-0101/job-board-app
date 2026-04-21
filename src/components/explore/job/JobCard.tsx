"use client";
import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface JobCardProps {
  id: number;
  slug: string;
  title: string;
  company: string;
  logo: string;
  city: string;
  salary: string;
  category: string;
  tags: string[];
  rating: number;
  banner?: string | null;
}

export function JobCard({
  id,
  slug,
  title,
  company,
  logo,
  city,
  salary,
  category,
  tags,
  banner,
}: JobCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatSalary = (value: string) => {
    if (!value) return "";
    return value
      .split("-")
      .map((v) => {
        const num = parseInt(v.trim().replace(/\D/g, ""));
        if (isNaN(num)) return v;
        return "IDR " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      })
      .join(" - ");
  };

  return (
    <Link
      href={`/explore/jobs/${slug}`}
      className="block w-full h-full max-w-full"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group w-full h-full max-w-full flex flex-col"
        aria-label={`${title} at ${company}`}
      >
        <div className="w-full h-full max-w-full bg-[#F0F5F9] text-card-foreground rounded-2xl transition-all duration-300 overflow-hidden box-border px-3 sm:px-5 py-4 sm:py-6 flex flex-col">
          {/* Gradient Border on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0 pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Job Banner */}
          {banner && (
            <div className="mb-4 -mx-3 sm:-mx-5 -mt-4 sm:-mt-6">
              <img
                src={banner}
                alt={`${title} banner`}
                className="w-full h-32 sm:h-40 object-cover rounded-t-2xl"
              />
            </div>
          )}

          {/* Header */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold text-primary shadow-sm shrink-0"
            >
              {logo ? (
                <img
                  src={logo}
                  alt={`${company} logo`}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
                />
              ) : (
                company.charAt(0)
              )}
            </motion.div>

            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-[#467EC7] whitespace-nowrap overflow-hidden truncate max-w-[68vw] sm:max-w-[16rem]">
                {title}
              </h3>
              <span className="block text-sm font-medium text-foreground/80 mt-1 truncate">
                {company}
              </span>
            </div>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground/70" />
              <span className="truncate">{city}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1">
                <span className="font-medium truncate">{formatSalary(salary)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-muted-foreground/70" />
              <span className="truncate">{category}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-auto overflow-hidden">
            {tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-2.5 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/20 whitespace-nowrap shrink-0"
              >
                {tag}
              </motion.span>
            ))}
            {tags.length > 3 && (
              <span className="px-2.5 py-1 bg-secondary text-muted-foreground text-xs font-medium border border-primary/10 rounded-full whitespace-nowrap shrink-0">
                +{tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
