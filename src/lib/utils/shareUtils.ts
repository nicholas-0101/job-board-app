export function generateShareLinks(companyUrl: string, message: string) {
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      companyUrl
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      companyUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(companyUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message + " " + companyUrl
    )}`,
  };
}

export function generateCompanyUrl(slug: string) {
  return `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/explore/companies/${slug}`;
}
