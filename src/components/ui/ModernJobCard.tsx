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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Hot Badge */}
      {isHot && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-full blur animate-pulse" />
            <div className="relative bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              HOT
            </div>
          </div>
        </motion.div>
      )}

      <div className="relative bg-white rounded-2xl border border-gray-100 hover:border-primary-300 transition-all duration-300 overflow-hidden">
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
                className="w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center text-2xl font-bold text-primary-600 shadow-sm"
              >
                {logo || company.charAt(0)}
              </motion.div>

              <div>
                <Link href={`/explore/jobs/${id}`}>
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors cursor-pointer">
                    {title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-medium text-gray-700">{company}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-600">{rating}</span>
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
                  ? "bg-primary-100 text-primary-600" 
                  : "hover:bg-gray-100 text-gray-400"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            </motion.button>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>{city}</span>
            </div>
            {salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{salary}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{posted}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{applicants} applicants</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-3 py-1 bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-200/50"
              >
                {tag}
              </motion.span>
            ))}
            {tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{tags.length - 3} more
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link href={`/explore/jobs/${id}`} className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
              >
                View Details
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2.5 border-2 border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-600 font-medium rounded-xl transition-all duration-300"
            >
              Quick Apply
            </motion.button>
          </div>

          {/* Hover Effect - Additional Info */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-100"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    <span className="font-medium text-gray-900">{type}</span> position
                  </span>
                  <span className="text-primary-600 font-medium">
                    Match: 92%
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar for Applications */}
        <div className="px-6 pb-3">
          <div className="relative h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((applicants / 100) * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {applicants < 20 ? "Few applicants" : applicants < 50 ? "Moderate competition" : "High competition"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
