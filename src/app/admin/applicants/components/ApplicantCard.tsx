"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Eye,
  Clock,
  FileText,
  DollarSign,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApplicantDTO } from "@/lib/applicants";

interface ApplicantCardProps {
  applicant: ApplicantDTO;
  onUpdateStatus: (applicationId: number, newStatus: string) => void;
}

export default function ApplicantCard({ applicant, onUpdateStatus }: ApplicantCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await onUpdateStatus(applicant.applicationId, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <img
              src={applicant.profilePicture || "/fallback_pfp_image.jpg"}
              alt={applicant.userName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-semibold text-foreground truncate">
                  {applicant.userName}
                </h4>
                {applicant.isPriority && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full">
                    <Star className="w-3 h-3 text-amber-600 fill-amber-400" />
                    <span className="text-xs font-medium text-amber-700">Priority</span>
                  </div>
                )}
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    applicant.status
                  )}`}
                >
                  {applicant.status}
                </span>
                {applicant.score !== null && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      applicant.preselectionPassed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    Test: {applicant.score}/25{" "}
                    {applicant.preselectionPassed ? "✓" : "✗"}
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="truncate">
                    {applicant.userEmail}
                  </span>
                </div>
                {applicant.expectedSalary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Rp {applicant.expectedSalary.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(applicant.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
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
                onClick={() => handleStatusUpdate("INTERVIEW")}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
                disabled={isUpdating || applicant.status === "INTERVIEW"}
              >
                Interview
              </Button>
              <Button
                size="sm"
                onClick={() => handleStatusUpdate("ACCEPTED")}
                className="bg-green-100 text-green-700 hover:bg-green-200"
                disabled={isUpdating || applicant.status === "ACCEPTED"}
              >
                Accept
              </Button>
              <Button
                size="sm"
                onClick={() => handleStatusUpdate("REJECTED")}
                className="bg-red-100 text-red-700 hover:bg-red-200"
                disabled={isUpdating || applicant.status === "REJECTED"}
              >
                Reject
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
