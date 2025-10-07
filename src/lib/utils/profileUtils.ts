export const formatDateForInput = (dateStr: string | null | undefined) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
};

export const mapPayloadToInitialValues = (payload: any) => {
  if (!payload) return null;

  console.log("=== Profile Payload ===", payload);
  
  // Check if this is a company profile (has ownerAdminId or slug field)
  const isCompanyProfile = payload?.ownerAdminId !== undefined || payload?.slug !== undefined;
  
  if (isCompanyProfile) {
    const mapped = {
      name: payload?.name ?? "",
      email: payload?.email ?? "",
      phone: payload?.phone ?? "",
      address: payload?.address ?? "",
      locationCity: payload?.locationCity ?? "",
      locationProvince: payload?.locationProvince ?? "",
      description: payload?.description ?? "",
      website: payload?.website ?? "",
      logoUrl: payload?.logoUrl ?? null,
      bannerUrl: payload?.bannerUrl ?? null,
      socials: typeof payload?.socials === 'object' ? {
        facebook: payload?.socials?.facebook ?? "",
        twitter: payload?.socials?.twitter ?? "",
        linkedin: payload?.socials?.linkedin ?? "",
        instagram: payload?.socials?.instagram ?? "",
      } : {
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      },
    };
    console.log("=== Mapped Company Profile ===", mapped);
    return mapped;
  }

  // User profile
  const mapped = {
    phone: payload?.phone ?? "",
    gender: payload?.gender ?? "",
    dob: payload?.dob ? formatDateForInput(payload.dob) : "",
    education: payload?.education ?? "",
    address: payload?.address ?? "",
    city: payload?.city ?? "",
    profilePicture: payload?.profilePicture ?? null,
  };
  console.log("=== Mapped User Profile ===", mapped);
  return mapped;
};