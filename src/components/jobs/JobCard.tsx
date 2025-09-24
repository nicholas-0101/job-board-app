"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Bookmark } from "lucide-react";

export function JobCard(props: { id: number; title: string; company: string; city: string; tags?: string[]; posted?: string }) {
  const { id, title, company, city, tags = [], posted } = props;
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/explore/jobs/${id}`} className="block bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="font-medium">{company}</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {city}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {posted && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {posted} ago
              </div>
            )}
            <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Bookmark className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        {!!tags.length && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((t) => (
              <span key={t} className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-medium">{t}</span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs px-3 py-1 rounded-full bg-gray-50 text-gray-600">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  );
}
