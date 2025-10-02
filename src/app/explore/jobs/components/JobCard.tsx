"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  Users,
  TrendingUp,
  Star,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  logo: string;
  city: string;
  salary: string;
  category: string;
  tags: string[];
  rating: number;
}

export function JobCard({
  id,
  title,
  company,
  logo,
  city,
  salary,
  category,
  tags,
  rating,
}: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
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
    <Link href={`/explore/jobs/${id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group"
        aria-label={`${title} at ${company}`}
      >
        <div className="min-h-45 relative bg-[#F0F5F9] text-card-foreground rounded-2xl transition-all duration-300 overflow-hidden">
          {/* Gradient Border on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-2xl font-bold text-primary shadow-sm"
                >
                  {logo ? (
                    <img
                      src={logo}
                      alt={`${company} logo`}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  ) : (
                    company.charAt(0)
                  )}
                </motion.div>

                <div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#467EC7] whitespace-nowrap overflow-hidden truncate transition-colors cursor-pointer">
                      {title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-medium text-foreground/80">
                      {company}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        className="w-3 h-3 text-yellow-400 fill-current"
                        aria-hidden="true"
                      />
                      <span className="text-xs text-muted-foreground">
                        {rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <MapPin
                  className="w-4 h-4 text-muted-foreground/70"
                  aria-hidden="true"
                />
                <span>{city}</span>
              </div>
              {salary && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">{formatSalary(salary)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Briefcase
                  className="w-4 h-4 text-muted-foreground/70"
                  aria-hidden="true"
                />
                <span>{category}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-primary/3 text-primary text-xs font-medium rounded-full border border-primary/20"
                >
                  {tag}
                </motion.span>
              ))}
              {tags.length > 3 && (
                <span className="px-3 py-1 bg-secondary text-muted-foreground text-xs font-medium rounded-full">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
