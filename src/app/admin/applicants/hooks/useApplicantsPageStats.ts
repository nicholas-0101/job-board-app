import { useMemo } from "react";
import { Users, Star, Clock, UserCheck, CheckCircle } from "lucide-react";
import { ApplicantWithJobId } from "./useApplicantsPageState";

export function useApplicantsPageStats(applicants: ApplicantWithJobId[], total: number) {
  return useMemo(
    () => [
      { label: "Total Applicants", value: total, icon: Users, color: "bg-blue-100", iconColor: "text-blue-500" },
      { label: "Priority Applications", value: applicants.filter((a) => a.isPriority).length, icon: Star, color: "bg-amber-100", iconColor: "text-amber-500" },
      { label: "Pending Review", value: applicants.filter((a) => a.status === "SUBMITTED").length, icon: Clock, color: "bg-yellow-100", iconColor: "text-yellow-500" },
      { label: "Interview Stage", value: applicants.filter((a) => a.status === "INTERVIEW").length, icon: UserCheck, color: "bg-purple-100", iconColor: "text-purple-500" },
      { label: "Accepted", value: applicants.filter((a) => a.status === "ACCEPTED").length, icon: CheckCircle, color: "bg-emerald-100", iconColor: "text-emerald-500" },
    ],
    [applicants, total]
  );
}
