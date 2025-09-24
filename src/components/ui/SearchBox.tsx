"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Briefcase, TrendingUp, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBoxProps {
  categories: string[];
  locations: string[];
}

export function SearchBox({ categories, locations }: SearchBoxProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const popularSearches = [
    "React Developer",
    "Product Manager",
    "UI/UX Designer",
    "Data Scientist"
  ];

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate search
    setTimeout(() => {
      setIsSearching(false);
      // Navigate to results
    }, 1500);
  };

  return (
    <motion.div 
      className="relative bg-card/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-border"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Smart Job Search</h3>
            <p className="text-xs text-muted-foreground">AI-powered matching</p>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-1 text-xs text-green-600 font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Live
        </motion.div>
      </div>

      {/* Search Fields */}
      <div className="space-y-4">
        {/* Keyword Input with Suggestions */}
        <div className="relative">
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Job title, keywords, or company" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-input focus:border-primary focus:outline-none transition-all duration-300 bg-secondary hover:bg-background" 
            />
            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && !keyword && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full bg-card text-card-foreground rounded-2xl shadow-xl border border-border p-3 z-10"
              >
                <p className="text-xs text-muted-foreground mb-2 px-2">Popular searches</p>
                {popularSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => {
                      setKeyword(search);
                      setShowSuggestions(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-sm text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="w-3 h-3" />
                    {search}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category and Location */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <motion.button 
          onClick={handleSearch}
          disabled={isSearching}
          className="relative w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
            animate={{ x: ["0%", "100%", "0%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ width: "200%" }}
          />
          
          <span className="relative flex items-center justify-center gap-2">
            {isSearching ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Searching...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Search {keyword ? `"${keyword}"` : "Jobs"}
                <motion.span
                  className="ml-1"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
              </>
            )}
          </span>
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <span>🔥 234 new jobs today</span>
        <span>⚡ Instant matching</span>
        <span>🎯 98% accuracy</span>
      </div>
    </motion.div>
  );
}
