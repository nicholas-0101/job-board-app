// Application status enum and utilities
export enum ApplicationStatus {
  SUBMITTED = "SUBMITTED",
  IN_REVIEW = "IN_REVIEW",
  INTERVIEW = "INTERVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export const statusStyles: Record<ApplicationStatus, string> = {
  [ApplicationStatus.SUBMITTED]: "bg-blue-100 text-blue-900",
  [ApplicationStatus.IN_REVIEW]: "bg-yellow-100 text-yellow-900",
  [ApplicationStatus.INTERVIEW]: "bg-purple-100 text-purple-900",
  [ApplicationStatus.ACCEPTED]: "bg-green-100 text-green-900",
  [ApplicationStatus.REJECTED]: "bg-red-100 text-red-900",
};

export const formatStatus = (status: ApplicationStatus) => {
  switch (status) {
    case ApplicationStatus.IN_REVIEW:
      return "IN REVIEW";
    case ApplicationStatus.INTERVIEW:
      return "INTERVIEW";
    case ApplicationStatus.ACCEPTED:
      return "ACCEPTED";
    case ApplicationStatus.REJECTED:
      return "REJECTED";
    default:
      return "SUBMITTED";
  }
};

// Currency formatting utility
export const formatIDR = (value: number) =>
  `IDR ${new Intl.NumberFormat("id-ID").format(value)}`;
