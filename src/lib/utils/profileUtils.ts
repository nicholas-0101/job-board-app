export const formatDateForInput = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
};

export const mapPayloadToInitialValues = (payload: any) => {
  if (!payload) return null;

  if (payload?.role === "ADMIN" || payload?.adminId) {
    return {
      phone: payload?.phone ?? "",
      location: payload?.location ?? "",
      city: payload?.city ?? "",
      description: payload?.description ?? "",
      website: payload?.website ?? "",
      logo: payload?.logo ?? null,
    };
  }

  return {
    phone: payload?.phone ?? "",
    gender: payload?.gender ?? "",
    dob: payload?.dob ? formatDateForInput(payload.dob) : "",
    education: payload?.education ?? "",
    address: payload?.address ?? "",
    city: payload?.city ?? "",
    profilePicture: payload?.profilePicture ?? null,
  };
};