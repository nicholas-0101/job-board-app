"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Share2, Bookmark, MapPin, Clock, Building2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface JobDetailCardProps {
  job: any;
}

export default function JobDetailCard({ job }: JobDetailCardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handlePretestClick = () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }
    router.push(`/jobs/${job.id}/pretest`);
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push("/go-to-signin");
      return;
    }
    router.push(`/jobs/${job.id}/apply`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#F0F5F9] text-card-foreground rounded-2xl p-6"
    >
      {/* Title + Actions */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-[#467EC7]">{job.title}</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePretestClick}
            className="px-4 py-2 rounded-lg bg-[#467EC7] text-white hover:bg-[#467EC7]/80 text-sm font-medium transition-colors cursor-pointer"
          >
            Pretest
          </button>
          <button
            onClick={handleApplyClick}
            className="px-4 py-2 rounded-lg bg-[#24CFA7] text-white hover:bg-[#24CFA7]/80 text-sm font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
          <button className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer">
            <Share2 className="w-4 h-4 text-foreground" />
          </button>
          <button className="p-2 rounded-lg hover:text-muted-foreground cursor-pointer">
            <Bookmark className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Company + City + Deadline */}
      <div className="flex items-center gap-6 text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Building2 className="w-4 h-4" />
          {job.company?.id ? (
            <Link
              href={`/explore/companies/${job.company.id}`}
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
            {job.deadline ? new Date(job.deadline).toDateString() : ""}
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
      <div className="text-muted-foreground whitespace-pre-line">
        {job.description}
      </div>
    </motion.div>
  );
}
