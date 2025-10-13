"use client";

import Container from "@/components/common/Container";
import DeveloperBlockGuard from "@/components/auth/DeveloperBlockGuard";
import { useMyApplications } from "@/lib/hooks/useMyApplications";
import MyApplicationsHeader from "@/components/my-applications/MyApplicationsHeader";
import MyApplicationsLoading from "@/components/my-applications/MyApplicationsLoading";
import MyApplicationsEmpty from "@/components/my-applications/MyApplicationsEmpty";
import ApplicationCard from "@/components/my-applications/ApplicationCard";
import MyApplicationsPagination from "@/components/my-applications/MyApplicationsPagination";

export default function MyApplicationsPage() {
  const {
    applications,
    loading,
    sortOrder,
    page,
    totalPages,
    toggleSortOrder,
    handlePageChange,
  } = useMyApplications();

  return (
    <DeveloperBlockGuard>
      <div className="bg-gradient-to-br from-[#467EC7]/10 via-white to-[#24CFA7]/10">
        <Container className="py-6 sm:py-10 max-w-4xl">
          <MyApplicationsHeader
            sortOrder={sortOrder}
            onSortToggle={toggleSortOrder}
          />

          {loading ? (
            <MyApplicationsLoading />
          ) : applications.length === 0 ? (
            <MyApplicationsEmpty />
          ) : (
            <>
              <div className="space-y-3 sm:space-y-4">
                {applications.map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              </div>

              <MyApplicationsPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </Container>
      </div>
    </DeveloperBlockGuard>
  );
}
