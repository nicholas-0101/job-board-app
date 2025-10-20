"use client";
import { ApplicantsHeader } from "./components/ApplicantsHeader";
import { ApplicantStatsGrid, StatItem } from "./components/ApplicantStatsGrid";
import { ApplicantFilters } from "./components/ApplicantFilters";
import { ApplicantsList } from "./components/ApplicantsList";
import { ApplicantsPagination } from "./components/ApplicantsPagination";
import { useApplicantsPageState } from "./hooks/useApplicantsPage";

export default function ApplicantsPage() {
  const {
    loading,
    applicants,
    total,
    jobs,
    selectedJobId,
    setSelectedJobId,
    searchName,
    setSearchName,
    education,
    setEducation,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    salaryMin,
    setSalaryMin,
    salaryMax,
    setSalaryMax,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    fetchApplicants,
    handleApplyFilters,
    handleUpdateStatus,
    stats,
    totalPages,
  } = useApplicantsPageState();

  return (
    <div className="min-h-screen">
      <ApplicantsHeader loading={loading} onRefresh={fetchApplicants} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <ApplicantStatsGrid stats={stats as unknown as StatItem[]} />

        <ApplicantFilters
          jobs={jobs}
          selectedJobId={selectedJobId}
          setSelectedJobId={(id:number)=>setSelectedJobId(id)}
          searchName={searchName}
          setSearchName={setSearchName}
          education={education}
          setEducation={setEducation}
          sortBy={sortBy}
          setSortBy={setSortBy as any}
          ageMin={ageMin}
          setAgeMin={setAgeMin}
          ageMax={ageMax}
          setAgeMax={setAgeMax}
          salaryMin={salaryMin}
          setSalaryMin={setSalaryMin}
          salaryMax={salaryMax}
          setSalaryMax={setSalaryMax}
          onApply={handleApplyFilters}
        />

        <ApplicantsList
          applicants={applicants as any}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
        />

        <ApplicantsPagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
}
