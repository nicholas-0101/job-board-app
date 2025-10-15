"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Users } from "lucide-react";

interface RecentJobsCardProps {
  loading: boolean;
  recentJobs: any[];
}

export function RecentJobsCard({ loading, recentJobs }: RecentJobsCardProps) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#467EC7]" />
            Recent Job Postings
          </CardTitle>
          <Link href="/admin/jobs">
            <Button size="sm" variant="ghost" className="text-xs">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse p-3 bg-secondary rounded-xl"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : recentJobs.length > 0 ? (
          <div className="space-y-3">
            {recentJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/admin/jobs/${job.id}/edit`}>
                  <div className="p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all cursor-pointer border border-transparent hover:border-[#24CFA7]">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm truncate">
                          {job.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.city}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {job.applicantsCount} applicants
                          </span>
                        </div>
                      </div>
                      {job.isPublished ? (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 font-medium">
                          Draft
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No jobs yet</p>
            <Link href="/admin/jobs/new">
              <Button
                size="sm"
                className="mt-2 bg-[#24CFA7] hover:bg-[#1fc39c]"
              >
                Create Job
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
