"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, Bookmark, MapPin, Clock, DollarSign, 
  Building2, Users, Calendar, ExternalLink,
  Facebook, Twitter, Linkedin, MessageCircle,
  Copy, Check, X
} from "lucide-react";
import FilterSidebar from "@/components/jobboard/FilterSidebar";
import Container from "@/components/common/Container";
import JobCardPro from "@/components/jobboard/JobCardPro";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  
  const job = { 
    id: Number(params.id), 
    title: "Senior Frontend Engineer", 
    company: "TechNova", 
    city: "Jakarta", 
    description: "We are looking for a talented Senior Frontend Engineer to join our dynamic team. You will be responsible for developing user-facing features using modern JavaScript frameworks, collaborating with designers and backend developers, and ensuring optimal user experience across all devices.\n\nKey Responsibilities:\n• Develop responsive web applications using React.js and Next.js\n• Collaborate with UI/UX designers to implement pixel-perfect designs\n• Optimize applications for maximum speed and scalability\n• Write clean, maintainable, and well-documented code\n• Participate in code reviews and mentor junior developers\n\nRequirements:\n• 4+ years of experience in frontend development\n• Strong proficiency in React.js, Next.js, and TypeScript\n• Experience with Tailwind CSS and modern CSS frameworks\n• Knowledge of state management libraries (Redux, Zustand)\n• Familiarity with testing frameworks (Jest, Cypress)\n• Strong problem-solving skills and attention to detail", 
    tags: ["React","Next.js","Tailwind","TypeScript","Frontend"], 
    salary: "IDR 15-25jt",
    type: "Full-time",
    experience: "4+ years",
    posted: "2 days ago",
    applicants: 23,
    remote: false
  };

  const jobUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/explore/jobs/${job.id}`;
  const defaultMessage = `Check out this amazing job opportunity: ${job.title} at ${job.company} in ${job.city}. ${job.salary} salary range!`;

  const shareOptions = [
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => {
        const message = customMessage || defaultMessage;
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}&summary=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-500 hover:bg-blue-600",
      action: () => {
        const message = customMessage || defaultMessage;
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600",
      action: () => {
        const message = customMessage || defaultMessage;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(jobUrl)}`;
        window.open(url, '_blank');
      }
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      action: () => {
        const message = customMessage || defaultMessage;
        const url = `https://wa.me/?text=${encodeURIComponent(message + ' ' + jobUrl)}`;
        window.open(url, '_blank');
      }
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Filters */}
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>

          {/* Middle: Job Detail */}
          <div className="lg:col-span-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-sm"
            >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-2xl flex items-center justify-center text-primary-foreground text-2xl font-bold">
                  {job.company[0]}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-2">{job.title}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{job.posted}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {job.type}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {job.experience}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {job.applicants} applicants
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-lg font-semibold text-foreground">{job.salary}</span>
                <span className="text-muted-foreground">per month</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:w-48">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl shadow-sm hover:opacity-90 transition"
              >
                Apply Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border-2 border-border text-foreground/80 font-medium rounded-xl hover:bg-secondary transition flex items-center justify-center gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Save Job
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowShareModal(true)}
                className="px-6 py-3 border-2 border-primary/30 text-primary font-medium rounded-xl hover:bg-primary/10 transition flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Job
              </motion.button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-secondary text-foreground/80 rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>

          {/* Job Description */}
          <div className="prose max-w-none">
            <h3 className="text-xl font-semibold text-foreground mb-3">Job Description</h3>
            <div className="text-foreground/80 whitespace-pre-line leading-relaxed">
              {job.description}
            </div>
          </div>
            </motion.div>

          </div>

          {/* Right: Related Jobs */}
          <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Related Jobs</h2>
            <Link href="/explore/jobs" className="text-primary hover:opacity-80 font-medium flex items-center gap-1">
              See all <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-3">
            {[1,2,3].map((i) => (
              <JobCardPro key={i} id={i} title="Frontend Engineer" company="Company" city="Jakarta" tags={["React","TS"]} posted="3d" salary="IDR 12-20M" />
            ))}
          </div>
        </motion.section>

        {/* Share Modal */}
        <AnimatePresence>
          {showShareModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowShareModal(false)}
            >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card text-card-foreground rounded-3xl p-8 max-w-md w-full border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">Share Job</h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                  <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                {/* Custom Message */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder={defaultMessage}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none resize-none bg-card text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave empty to use default message
                  </p>
                </div>

                {/* Share Options */}
                <div className="space-y-3 mb-6">
                  {shareOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <motion.button
                        key={option.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={option.action}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${option.color} text-white font-semibold rounded-xl transition-all`}
                      >
                        <IconComponent className="w-5 h-5" />
                        Share on {option.name}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Copy Link */}
                <div className="border-t border-border pt-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Or copy link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={jobUrl}
                      readOnly
                      className="flex-1 px-4 py-3 bg-secondary border border-border rounded-xl text-sm text-muted-foreground"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyToClipboard}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                        copiedLink
                          ? "bg-green-500 text-white"
                          : "bg-secondary text-foreground/80 hover:bg-secondary/80"
                      }`}
                    >
                      {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  {copiedLink && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-green-600 mt-2"
                    >
                      ✓ Link copied to clipboard!
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
