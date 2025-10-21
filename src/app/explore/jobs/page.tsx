"use client";

import { useJobsPage } from "@/lib/hooks/useJobsPage";
import JobsHero from "@/components/explore/jobs/JobsHero";
import JobsControls from "@/components/explore/jobs/JobsControls";
import JobsList from "@/components/explore/jobs/JobsList";
import JobsPagination from "@/components/explore/jobs/JobsPagination";

export default function JobsPage() {
  const {
    loading,
    viewMode,
    filters,
    page,
    jobs,
    total,
    error,
    searchInputs,
    setSearchInputs,
    showPostedDropdown,
    wrapperRef,
    handleSearch,
    toggleSortOrder,
    handleViewModeChange,
    handlePageChange,
    handleToggleDropdown,
    handleSelectPostedWithin,
    totalPages,
    setUserHasInteractedWithLocation,
  } = useJobsPage();

  return (
    <section className="min-h-screen">
      <JobsHero
        searchInputs={searchInputs}
        onKeywordChange={(value) =>
          setSearchInputs((prev) => ({ ...prev, keyword: value }))
        }
        onLocationChange={(value) =>
          setSearchInputs((prev) => ({ ...prev, location: value }))
        }
        onSearch={handleSearch}
        onLocationInteraction={() => setUserHasInteractedWithLocation(true)}
      />

      <section className="lg:max-w-6xl mx-auto pb-8 sm:pb-12 px-4">
        <JobsControls
          jobsCount={jobs.length}
          totalCount={total}
          filters={filters}
          viewMode={viewMode}
          showPostedDropdown={showPostedDropdown}
          onSortChange={toggleSortOrder}
          onViewModeChange={handleViewModeChange}
          onToggleDropdown={handleToggleDropdown}
          onSelectPostedWithin={handleSelectPostedWithin}
          wrapperRef={wrapperRef as React.RefObject<HTMLDivElement>}
        />

        <JobsList
          loading={loading}
          jobs={jobs}
          viewMode={viewMode}
          page={page}
          filters={filters}
        />

        <JobsPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </section>
  );
}
