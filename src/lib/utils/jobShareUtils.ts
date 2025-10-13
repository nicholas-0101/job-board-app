export function generateJobShareLinks(jobUrl: string, message: string) {
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      jobUrl
    )}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      jobUrl
    )}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      message
    )}&url=${encodeURIComponent(jobUrl)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(
      message + " " + jobUrl
    )}`,
  };
}

export function generateJobUrl(slug: string) {
  return `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/explore/jobs/${slug}`;
}
