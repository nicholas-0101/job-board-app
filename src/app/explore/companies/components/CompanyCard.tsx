"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { apiCall } from "@/helper/axios";
import StarRating from "@/components/StarRating";

interface CompanyCardProps {
  id: number;
  slug: string;
  name: string;
  locationCity?: string;
  logo?: string;
  jobs?: number;
  rating?: number;
}

export function CompanyCard({
  id,
  slug,
  name,
  locationCity = "Unknown",
  logo,
  jobs = 0,
}: CompanyCardProps) {
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await apiCall.get(`/reviews/companies/${id}/reviews/stats`);
        setRating(parseFloat(res.data.data?.avgOverallRating) || 0);
      } catch {
        setRating(0);
      }
    };
    fetchRating();
  }, [id]);

  return (
    <Link href={`/explore/companies/${slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="relative group min-h-[150px] bg-[#F0F5F9] text-card-foreground rounded-2xl overflow-hidden p-6 flex flex-col justify-between"
        aria-label={`${name} in ${locationCity}`}
      >
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-14 h-14 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center text-2xl font-bold text-primary shadow-sm"
        >
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="w-14 h-14 object-contain rounded-lg"
            />
          ) : (
            name.charAt(0)
          )}
        </motion.div>

        {/* Name & City */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[#467EC7] truncate">
            {name}
          </h3>
          <p className="text-sm text-muted-foreground">{locationCity}</p>
        </div>

        {/* Jobs count */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground">
          <Users className="w-4 h-4" />
          <span>
            {jobs} open {jobs === 1 ? "job" : "jobs"}
          </span>
        </div>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {rating !== null ? (
            <>
              <StarRating rating={rating} />
            </>
          ) : (
            <span className="text-muted-foreground/50">Loading...</span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
