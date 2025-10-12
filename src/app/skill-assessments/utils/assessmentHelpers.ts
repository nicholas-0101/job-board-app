import {
  Assessment,
  AssessmentStats as StatsType,
  AssessmentFilters as FiltersType,
} from "@/types/skillAssessment";

export const filterAssessments = (
  assessments: Assessment[],
  filters: FiltersType,
  searchQuery: string
) => {
  let filtered = assessments;

  if (filters.category !== "all") {
    filtered = filtered.filter(
      (a) => a.badgeTemplate?.name === filters.category
    );
  }

  if (searchQuery) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
};

export const sortAssessments = (assessments: Assessment[], sortBy: string) => {
  switch (sortBy) {
    case "title":
      return [...assessments].sort((a, b) => a.title.localeCompare(b.title));
    default:
      return assessments;
  }
};

export const calculateStats = (assessments: Assessment[]): StatsType => {
  const totalParticipants = assessments.reduce(
    (sum, a) => sum + a._count.results,
    0
  );

  return {
    totalAssessments: assessments.length,
    totalParticipants,
  };
};

export const extractUniqueCategories = (assessments: Assessment[]) => {
  const uniqueBadges = new Set<string>();

  assessments.forEach((assessment) => {
    if (assessment.badgeTemplate?.name) {
      uniqueBadges.add(assessment.badgeTemplate.name);
    }
  });

  return [
    { value: "all", label: "All Categories" },
    ...Array.from(uniqueBadges)
      .sort()
      .map((badge) => ({
        value: badge,
        label: badge,
      })),
  ];
};
