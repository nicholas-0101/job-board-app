"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, DollarSign, Clock, Bookmark, Users, TrendingUp, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  logo?: string;
  city: string;
  salary?: string;
  type?: string;
  posted: string;
  tags: string[];
  applicants?: number;
  isHot?: boolean;
  rating?: number;
}

export function ModernJobCard({
  id,
  title,
  company,
  logo,
  city,
  salary,
  type = "Full-time",
  posted,
  tags,
  applicants = 20,
  isHot = false,
  rating = 4.5
}: JobCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

      <div className="relative bg-[#F0F5F9] text-card-foreground rounded-2xl transition-all duration-300 overflow-hidden">
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
                {logo || company.charAt(0)}
              </motion.div>

              <div>
                  <h3 className="text-lg font-semibold text-[#467EC7] transition-colors cursor-pointer">
                    {title}
                  </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-medium text-foreground/80">{company}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" aria-hidden="true" />
                    <span className="text-xs text-muted-foreground">{rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bookmark Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                ? "bg-primary/10 text-primary" 
                : "hover:bg-secondary text-muted-foreground"
              }`}
              aria-pressed={isBookmarked}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            </motion.button>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-muted-foreground/70" aria-hidden="true" />
              <span>{city}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-muted-foreground/70" aria-hidden="true" />
                <span className="font-medium">{salary}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground/70" aria-hidden="true" />
              <span>{posted}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground/70" aria-hidden="true" />
              <span>{applicants} applicants</span>
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
              className="px-3 py-1 bg-gradient-to-r from-primary/5 to-secondary/5 text-primary text-xs font-medium rounded-full border border-primary/20"
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
