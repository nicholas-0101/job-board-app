"use client";

import Container from "@/components/common/Container";
import DeveloperBlockGuard from "@/components/auth/DeveloperBlockGuard";

import SavedJobsLoading from "@/components/saved-jobs/SavedJobsLoading";
import SavedJobsHeader from "@/components/saved-jobs/SavedJobsHeader";
import SavedJobsEmpty from "@/components/saved-jobs/SavedJobsEmpty";
import SavedJobsGrid from "@/components/saved-jobs/SavedJobsGrid";
import SavedJobsPagination from "@/components/saved-jobs/SavedJobsPagination";
import { useSavedJobs } from "@/lib/hooks/useSavedJobs";
import { getVisiblePages } from "@/lib/utils/paginationUtils";

export default function SavedJobsPage() {
  const { savedJobs, loading, sortOrder, page, totalPages, toggleSortOrder, setPage } = useSavedJobs();

  return (
    <DeveloperBlockGuard>
      <section className="bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10 min-h-screen">
        <Container className="py-10 max-w-6xl">
          <SavedJobsHeader sortOrder={sortOrder} onToggleSort={toggleSortOrder} />

          {loading ? (
            <SavedJobsLoading />
          ) : savedJobs.length === 0 ? (
            <SavedJobsEmpty />
          ) : (
            <>
              <SavedJobsGrid savedJobs={savedJobs} />
              <SavedJobsPagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                getVisiblePages={getVisiblePages}
              />
            </>
          )}
        </Container>
      </section>
    </DeveloperBlockGuard>
  );
}
