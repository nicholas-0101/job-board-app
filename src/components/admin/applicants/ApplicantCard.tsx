import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Star } from "lucide-react";
import { ApplicantDTO } from "@/lib/applicants";

interface ApplicantCardProps {
  applicant: ApplicantDTO;
  index: number;
  onUpdateStatus: (applicationId: number, status: "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED") => void;
  getStatusColor: (status: string) => string;
}

export default function ApplicantCard({ 
  applicant, 
  index, 
  onUpdateStatus, 
  getStatusColor 
}: ApplicantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={applicant.profilePicture || "/fallback_pfp_image.jpg"}
              alt={applicant.userName}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">
                  {applicant.userName}
                </h4>
                {applicant.isPriority && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full">
                    <Star className="w-3 h-3 text-amber-600 fill-amber-400" />
                    <span className="text-xs font-medium text-amber-700">
                      Priority
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {applicant.userEmail}
              </p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                applicant.status
              )}`}
            >
              {applicant.status}
            </span>
          </div>

          {applicant.score !== null && (
            <div className="mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  applicant.preselectionPassed
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Test: {applicant.score}/25{" "}
                {applicant.preselectionPassed ? "✓ Passed" : "✗ Failed"}
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            {applicant.expectedSalary && (
              <div className="text-muted-foreground">
                💰 Rp {applicant.expectedSalary.toLocaleString()}
              </div>
            )}
            <div className="text-muted-foreground">
              📅 {new Date(applicant.appliedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            {applicant.cvFile && (
              <a href={applicant.cvFile} target="_blank" rel="noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="hover:bg-secondary"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  CV
                </Button>
              </a>
            )}
            <Button
              size="sm"
              onClick={() => onUpdateStatus(applicant.applicationId, "INTERVIEW")}
              className="bg-purple-100 text-purple-700 hover:bg-purple-200"
            >
              Interview
            </Button>
            <Button
              size="sm"
              onClick={() => onUpdateStatus(applicant.applicationId, "ACCEPTED")}
              className="bg-green-100 text-green-700 hover:bg-green-200"
            >
              Accept
            </Button>
            <Button
              size="sm"
              onClick={() => onUpdateStatus(applicant.applicationId, "REJECTED")}
              className="bg-red-100 text-red-700 hover:bg-red-200"
            >
              Reject
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
