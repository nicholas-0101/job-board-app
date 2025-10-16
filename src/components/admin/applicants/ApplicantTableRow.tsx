import { Button } from "@/components/ui/button";
import { Eye, Star } from "lucide-react";
import { ApplicantDTO } from "@/lib/applicants";

interface ApplicantTableRowProps {
  applicant: ApplicantDTO;
  onUpdateStatus: (applicationId: number, status: "IN_REVIEW" | "INTERVIEW" | "ACCEPTED" | "REJECTED") => void;
  getStatusColor: (status: string) => string;
}

export default function ApplicantTableRow({ 
  applicant, 
  onUpdateStatus, 
  getStatusColor 
}: ApplicantTableRowProps) {
  return (
    <tr className="hover:bg-secondary/50 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={applicant.profilePicture || "/fallback_pfp_image.jpg"}
            alt={applicant.userName}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <div className="font-medium">
                {applicant.userName}
              </div>
              {applicant.isPriority && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-full">
                  <Star className="w-3 h-3 text-amber-600 fill-amber-400" />
                  <span className="text-xs font-medium text-amber-700">
                    Priority
                  </span>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {applicant.userEmail}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm">
        {(applicant as any).education || "-"}
      </td>
      <td className="p-4 text-sm">
        {(applicant as any).age || "-"}
      </td>
      <td className="p-4 text-sm">
        {applicant.expectedSalary
          ? `Rp ${applicant.expectedSalary.toLocaleString()}`
          : "-"}
      </td>
      <td className="p-4">
        {applicant.score !== null ? (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              applicant.preselectionPassed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {applicant.score}/25 {applicant.preselectionPassed ? "✓" : "✗"}
          </span>
        ) : (
          <span className="text-muted-foreground text-sm">
            -
          </span>
        )}
      </td>
      <td className="p-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
            applicant.status
          )}`}
        >
          {applicant.status}
        </span>
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          {applicant.cvFile && (
            <a
              href={applicant.cvFile}
              target="_blank"
              rel="noreferrer"
            >
              <Button
                size="sm"
                variant="outline"
                className="hover:bg-secondary"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </a>
          )}
          <Button
            size="sm"
            onClick={() => onUpdateStatus(applicant.applicationId, "INTERVIEW")}
            className="bg-purple-100 text-purple-700 hover:bg-purple-200 text-xs"
          >
            Interview
          </Button>
          <Button
            size="sm"
            onClick={() => onUpdateStatus(applicant.applicationId, "ACCEPTED")}
            className="bg-green-100 text-green-700 hover:bg-green-200 text-xs"
          >
            Accept
          </Button>
          <Button
            size="sm"
            onClick={() => onUpdateStatus(applicant.applicationId, "REJECTED")}
            className="bg-red-100 text-red-700 hover:bg-red-200 text-xs"
          >
            Reject
          </Button>
        </div>
      </td>
    </tr>
  );
}
