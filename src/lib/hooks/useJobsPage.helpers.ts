export function mapJobsResponse(res: any) {
  const jobsData = res.data.data.map((job: any) => ({
    id: job.id,
    slug: job.slug,
    title: job.title,
    company: job.companyName,
    logo: job.companyLogo || "",
    city: job.city,
    salary: job.salary || "",
    category: job.category || "",
    tags: job.tags || [],
    rating: Math.floor(Math.random() * 2) + 4,
    createdAt: job.createdAt,
  }));
  return {
    jobsData,
    total: res.data.total ?? 0,
  };
}

export function buildJobsQueryParams(filters: any, page: number, limit: number) {
  return {
    keyword: filters.keyword || undefined,
    city: filters.location || undefined,
    limit,
    page,
    sortBy: filters.sort,
    sortOrder: filters.order,
    postedWithin: filters.postedWithin,
  } as const;
}

export function buildJobsUrl(filters: any, page: number) {
  const params = new URLSearchParams();
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.location) params.set("city", filters.location);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.order) params.set("order", filters.order);
  if (page > 1) params.set("page", page.toString());
  return `/explore/jobs${params.toString() ? "?" + params.toString() : ""}`;
}

