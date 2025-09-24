"use client";
import { motion } from "framer-motion";

export function JobCardSkeleton() {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
            <div className="flex items-center gap-4">
              <div className="h-4 bg-gray-200 rounded-lg w-24"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-20"></div>
            </div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-18"></div>
        </div>
      </div>
    </motion.div>
  );
}
