"use client";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Star, FileText, DollarSign, Clock } from "lucide-react";

export type Applicant = {
  applicationId: number;
  userName: string;
  userEmail: string;
  profilePicture?: string | null;
  isPriority?: boolean;
  status: string;
  score: number | null;
  preselectionPassed?: boolean;
  expectedSalary?: number | null;
  appliedAt: string | number | Date;
  cvFile?: string | null;
};

export function ApplicantsList({
  applicants,
  loading,
  onUpdateStatus,
}: {
  applicants: Applicant[];
  loading: boolean;
  onUpdateStatus: (applicationId: number, status: string) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";
      case "IN_REVIEW":
        return "bg-blue-100 text-blue-700";
      case "INTERVIEW":
        return "bg-purple-100 text-purple-700";
      case "ACCEPTED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#24CFA7] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading applicants...</p>
        </div>
      </div>
    );
  }

  if (!loading && applicants.length === 0) {
    return (
      <Card className="border-dashed shadow-md">
        <CardContent className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#467EC7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <div>
              <p className="text-lg font-medium text-foreground mb-1">No applicants yet</p>
              <p className="text-muted-foreground">Applications will appear here when candidates apply</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant, index) => (
        <motion.div
          key={applicant.applicationId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="hover:shadow-lg transition-all duration-300 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <img
                  src={applicant.profilePicture || "/fallback_pfp_image.jpg"}
                  alt={applicant.userName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col gap-2 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-lg font-semibold text-foreground sm:truncate">{applicant.userName}</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {applicant.isPriority && (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full shrink-0">
                          <Star className="w-3 h-3 text-amber-600 fill-amber-400" />
                          <span className="text-xs font-medium text-amber-700">Priority</span>
                        </div>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(applicant.status)}`}>
                        {applicant.status}
                      </span>
                      {applicant.score !== null && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${applicant.preselectionPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          Test: {applicant.score}/25 {applicant.preselectionPassed ? "✓" : "✗"}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4" />
                      <span className="truncate sm:truncate break-all">{applicant.userEmail}</span>
                    </div>
                    {applicant.expectedSalary && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Rp {applicant.expectedSalary.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(applicant.appliedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full sm:w-auto flex-wrap gap-2 justify-start mt-2 sm:mt-0">
                  {applicant.cvFile && (
                    <a
                      href={applicant.cvFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition border border-blue-200"
                    >
                      <Eye className="w-5 h-5" />
                    </a>
                  )}
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(applicant.applicationId, "INTERVIEW")}
                    className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                    disabled={applicant.status === "INTERVIEW"}
                  >
                    Interview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(applicant.applicationId, "ACCEPTED")}
                    className="bg-green-100 text-green-700 hover:bg-green-200"
                    disabled={applicant.status === "ACCEPTED"}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(applicant.applicationId, "REJECTED")}
                    className="bg-red-100 text-red-700 hover:bg-red-200"
                    disabled={applicant.status === "REJECTED"}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}


