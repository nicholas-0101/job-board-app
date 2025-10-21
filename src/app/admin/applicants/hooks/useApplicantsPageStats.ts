import { useMemo } from "react";
import { Users, Star, Clock, UserCheck, CheckCircle } from "lucide-react";
import { ApplicantWithJobId } from "./useApplicantsPageState";

export function useApplicantsPageStats(applicants: ApplicantWithJobId[], total: number) {
  return useMemo(
    () => [
      { label: "Total Applicants", value: total, icon: Users, color: "from-blue-500 to-blue-600" },
      { label: "Priority Applications", value: applicants.filter((a) => a.isPriority).length, icon: Star, color: "from-amber-500 to-yellow-600" },
      { label: "Pending Review", value: applicants.filter((a) => a.status === "SUBMITTED").length, icon: Clock, color: "from-yellow-500 to-yellow-600" },
      { label: "Interview Stage", value: applicants.filter((a) => a.status === "INTERVIEW").length, icon: UserCheck, color: "from-purple-500 to-purple-600" },
      { label: "Accepted", value: applicants.filter((a) => a.status === "ACCEPTED").length, icon: CheckCircle, color: "from-green-500 to-green-600" },
    ],
    [applicants, total]
  );
}
