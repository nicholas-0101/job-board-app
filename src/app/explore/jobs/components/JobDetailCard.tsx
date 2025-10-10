"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, MapPin, Clock, Building2, CheckCircle, XCircle, AlertCircle, Bookmark } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ShareJobDialog from "./JobShareDialog";
import { apiCall } from "@/helper/axios";
import { jwtDecode } from "jwt-decode";

interface JobDetailCardProps {
  job: any;
}

interface DecodedToken {
  id: number;
  userId: number;
  [key: string]: any;
}

// Helper function to detect if text is HTML or plain text
const isHtmlContent = (text: string): boolean => {
  return /<[^>]+>/.test(text);
};

// Convert plain text to HTML with proper formatting
const convertPlainTextToHtml = (text: string): string => {
  if (!text) return '';
  
  // Split by double newlines for paragraphs
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  
  return paragraphs.map(para => {
    const trimmed = para.trim();
    
    // Check if it looks like a heading (short line, usually title-like)
    if (trimmed.length < 50 && !trimmed.includes('\n') && 
        (trimmed.match(/^[A-Z]/) || trimmed.includes('Role') || 
         trimmed.includes('Responsibilities') || trimmed.includes('Requirements') ||
         trimmed.includes('About') || trimmed.includes('Qualifications') ||
         trimmed.includes('Skills') || trimmed.includes('Benefits'))) {
      return `<h3>${trimmed}</h3>`;
    }
    
    // Check if it contains bullet points
    if (trimmed.includes('\n') && !trimmed.startsWith('-')) {
      const lines = trimmed.split('\n').filter(l => l.trim());
      // If all lines are short, it's likely a list
      if (lines.every(l => l.length < 100)) {
        return '<ul>' + lines.map(line => `<li>${line.trim()}</li>`).join('') + '</ul>';
      }
    }
    
    // Check if it starts with dash (bullet points)
    if (trimmed.startsWith('-')) {
      const items = trimmed.split('\n').map(line => line.replace(/^-\s*/, '').trim()).filter(Boolean);
      return '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }
    
    // Otherwise, treat as paragraph
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  }).join('\n');
};

export default function JobDetailCard({ job }: JobDetailCardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [openShare, setOpenShare] = useState(false);
  const [saved, setSaved] = useState(false);
  const [preselectionStatus, setPreselectionStatus] = useState<{
    required: boolean;
    submitted?: boolean;
    score?: number | null;
    passingScore?: number | null;
    isPassed?: boolean;
  } | null>(null);
  const router = useRouter();
  
  // Format description based on whether it's HTML or plain text
  const formattedDescription = isHtmlContent(job.description) 
    ? job.description 
    : convertPlainTextToHtml(job.description);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch preselection test status if authenticated
  useEffect(() => {
    const checkPreselectionStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token || !job.id) return;
      
      try {
        const response = await apiCall.get(`/preselection/jobs/${job.id}/my-status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPreselectionStatus(response.data.data);
      } catch (error: any) {
        // Silently ignore 404 (no test for this job)
        if (error.response?.status !== 404) {
          console.error("Failed to check preselection status:", error);
        }
      }
    };

    if (isAuthenticated) {
      checkPreselectionStatus();
    }
  }, [isAuthenticated, job.id]);

  const handlePretestClick = () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }
    router.push(`/jobs/${job.slug}/pretest`);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }
    
    // Check if preselection test is required but not completed
    if (preselectionStatus?.required && !preselectionStatus?.submitted) {
      alert("Please complete the pre-selection test before applying for this job.");
      router.push(`/jobs/${job.slug}/pretest`);
      return;
    }
    
    // Check if preselection test was failed
    if (preselectionStatus?.required && preselectionStatus?.submitted && !preselectionStatus?.isPassed) {
      alert("Your pre-selection test score does not meet the passing criteria for this job.");
      return;
    }
    
    router.push(`/jobs/${job.slug}/apply`);
  };

  const toggleSaveJob = async () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      if (!saved) {
        await apiCall.post(
          `/save/${job.id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSaved(true);
      } else {
        await apiCall.delete(`/save/unsave/${job.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSaved(false);
      }
    } catch (err) {
      console.error("Failed to toggle save job", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      const userId = decoded.userId;
      apiCall
        .get(`/save/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const savedJobs = res.data.data;
          setSaved(
            savedJobs.some((savedJob: any) => savedJob.job.id === job.id)
          );
        })
        .catch((err) => console.error("Failed to fetch saved jobs", err));
    }
  }, [job.id]);

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#F0F5F9] text-card-foreground rounded-2xl p-6"
      >
        {/* Title + Actions */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-[#467EC7]">{job.title}</h1>

          <div className="flex items-center gap-2">
            {preselectionStatus?.required && (
              <button
                onClick={handlePretestClick}
                className="px-4 py-2 rounded-lg bg-[#467EC7] text-white hover:bg-[#467EC7]/80 text-sm font-medium transition-colors cursor-pointer"
              >
                {preselectionStatus.submitted ? "View Test Result" : "Take Pretest"}
              </button>
            )}
            <button
              onClick={handleApplyClick}
              className="px-4 py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-sm font-medium transition-colors cursor-pointer"
            >
              Apply
            </button>
            <button
              onClick={() => setOpenShare(true)}
              className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={toggleSaveJob}
              className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer"
            >
              <Bookmark
                className={`w-5 h-5 ${
                  saved ? "text-foreground fill-current" : "text-foreground"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Preselection Test Status Banner */}
        {preselectionStatus?.required && isAuthenticated && (
          <div className={`mb-4 p-4 rounded-lg border ${
            preselectionStatus.submitted 
              ? preselectionStatus.isPassed 
                ? "bg-green-50 border-green-300" 
                : "bg-red-50 border-red-300"
              : "bg-yellow-50 border-yellow-300"
          }`}>
            <div className="flex items-center gap-2">
              {preselectionStatus.submitted ? (
                preselectionStatus.isPassed ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      ✓ Pre-selection Test Passed (Score: {preselectionStatus.score}/{preselectionStatus.passingScore || 25})
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">
                      ✗ Pre-selection Test Failed (Score: {preselectionStatus.score}/{preselectionStatus.passingScore || 25})
                    </span>
                  </>
                )
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    ⚠ Pre-selection Test Required - Complete the test before applying
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Company + City + Deadline */}
        <div className="flex items-center gap-6 text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {job.company?.slug ? (
              <Link
                href={`/explore/companies/${job.company.slug}`}
                className="text-muted-foreground hover:underline"
              >
                {job.company.name}
              </Link>
            ) : (
              <span>{job.company?.name}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.city}</span>
          </div>

          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>
              Deadline:{" "}
              {job.applyDeadline ? new Date(job.applyDeadline).toDateString() : "N/A"}
            </span>
          </div>
        </div>

        {/* Category */}
        <p className="mb-4">
          <span className="font-medium">Category:</span> {job.category}
        </p>

        {/* Salary */}
        {(job.salaryMin || job.salaryMax) && (
          <div className="flex items-center gap-1 text-foreground text-lg font-semibold mb-4">
            <span>
              IDR {job.salaryMin?.toLocaleString()} -{" "}
              {job.salaryMax?.toLocaleString()}
            </span>
          </div>
        )}

        {/* Tags */}
        {job.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags.map((tag: string, idx: number) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary/3 text-primary text-xs font-medium rounded-full border border-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        <div 
          className="text-muted-foreground prose prose-sm max-w-none 
                     prose-headings:text-foreground prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-3
                     prose-h1:text-2xl prose-h1:text-foreground prose-h1:font-bold prose-h1:mb-4
                     prose-h2:text-xl prose-h2:text-foreground prose-h2:font-bold prose-h2:mb-3
                     prose-h3:text-lg prose-h3:text-foreground prose-h3:font-semibold prose-h3:mb-3
                     prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-p:text-base
                     prose-ul:text-muted-foreground prose-ul:mb-4 prose-ul:list-disc prose-ul:pl-6
                     prose-ol:text-muted-foreground prose-ol:mb-4 prose-ol:list-decimal prose-ol:pl-6
                     prose-li:text-muted-foreground prose-li:mb-2 prose-li:text-base
                     prose-strong:text-foreground prose-strong:font-semibold
                     prose-em:text-foreground prose-em:italic
                     prose-a:text-[#467EC7] prose-a:underline prose-a:hover:text-[#24CFA7]
                     prose-blockquote:border-l-4 prose-blockquote:border-[#24CFA7] prose-blockquote:pl-4 prose-blockquote:italic
                     prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm"
          dangerouslySetInnerHTML={{ __html: formattedDescription }}
        />
      </motion.div>
      <ShareJobDialog
        open={openShare}
        onClose={() => setOpenShare(false)}
        job={{ title: job.title, slug: job.slug, id: job.id }}
      />
    </section>
  );
}
