"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export function UpcomingInterviewsCard({ interviews, loading }: { interviews: any[]; loading: boolean }) {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#24CFA7]" />
            Upcoming Interviews
          </CardTitle>
          <Link href="/admin/interviews">
            <Button size="sm" variant="ghost" className="text-xs">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map((i)=> (
              <div key={i} className="animate-pulse p-3 bg-secondary rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : interviews.length > 0 ? (
          <div className="space-y-3">
            {interviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-secondary/50 hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-[#467EC7]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{interview.candidateName}</h4>
                    <div className="flex flex-col gap-1 mt-1 text-xs text-muted-foreground">
                      <span className="truncate">{interview.jobTitle}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(interview.scheduleDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">{interview.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming interviews</p>
            <Link href="/admin/interviews">
              <Button size="sm" className="mt-2 bg-[#24CFA7] hover:bg-[#1fc39c]">Schedule Interview</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


