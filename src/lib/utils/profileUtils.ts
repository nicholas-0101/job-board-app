export const formatDateForInput = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
};

export const mapPayloadToInitialValues = (payload: any) => {
  if (!payload) return null;

  console.log("payload:", payload)
  if (payload?.role === "ADMIN" || payload?.ownerAdminId || payload?.slug) {
    return {
      phone: payload?.phone ?? "",
      address: payload?.address ?? "",
      locationCity: payload?.locationCity ?? "",
      description: payload?.description ?? "",
      website: payload?.website ?? "",
      logoUrl: payload?.logoUrl ?? null,
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