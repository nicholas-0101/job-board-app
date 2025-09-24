"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, DollarSign, Clock, MapPin, Briefcase, Star } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export function AdvancedFilters() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  
  const jobTypes: FilterOption[] = [
    { label: "Full-time", value: "full-time", count: 234 },
    { label: "Part-time", value: "part-time", count: 89 },
    { label: "Contract", value: "contract", count: 67 },
    { label: "Remote", value: "remote", count: 156 },
    { label: "Hybrid", value: "hybrid", count: 112 },
  ];
  
  const experienceLevels: FilterOption[] = [
    { label: "Entry Level", value: "entry", count: 145 },
    { label: "Mid Level", value: "mid", count: 289 },
    { label: "Senior Level", value: "senior", count: 167 },
    { label: "Lead", value: "lead", count: 78 },
    { label: "Manager", value: "manager", count: 45 },
  ];
  
  const salaryRanges: FilterOption[] = [
    { label: "< 5M", value: "0-5", count: 89 },
    { label: "5M - 10M", value: "5-10", count: 156 },
    { label: "10M - 20M", value: "10-20", count: 234 },
    { label: "20M - 30M", value: "20-30", count: 112 },
    { label: "> 30M", value: "30+", count: 67 },
  ];

  const toggleFilter = (value: string) => {
    setSelectedFilters(prev => 
      prev.includes(value) 
        ? prev.filter(f => f !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-700">Filters</span>
        {selectedFilters.length > 0 && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            {selectedFilters.length}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 left-0 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Filter Sections */}
            <div className="space-y-6">
              {/* Job Type */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700">Job Type</h4>
                </div>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <label
                      key={type.value}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(type.value)}
                          onChange={() => toggleFilter(type.value)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">{type.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700">Experience Level</h4>
                </div>
                <div className="space-y-2">
                  {experienceLevels.map((level) => (
                    <label
                      key={level.value}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(level.value)}
                          onChange={() => toggleFilter(level.value)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{level.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">{level.count}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700">Salary Range (IDR)</h4>
                </div>
                <div className="space-y-2">
                  {salaryRanges.map((range) => (
                    <label
                      key={range.value}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(range.value)}
                          onChange={() => toggleFilter(range.value)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{range.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">{range.count}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => setSelectedFilters([])}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
