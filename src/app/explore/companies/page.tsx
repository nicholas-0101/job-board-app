"use client";

import { useCompaniesPage } from "@/lib/hooks/useCompaniesPage";
import CompaniesHero from "@/components/explore/companies/CompaniesHero";
import CompaniesControls from "@/components/explore/companies/CompaniesControls";
import CompaniesList from "@/components/explore/companies/CompaniesList";
import CompaniesPagination from "@/components/explore/companies/CompaniesPagination";

export default function CompaniesPage() {
  const {
    loading,
    viewMode,
    filters,
    page,
    companies,
    total,
    error,
    searchInputs,
    setSearchInputs,
    handleSearch,
    handleSortChange,
    handleViewModeChange,
    handlePageChange,
    totalPages,
  } = useCompaniesPage();

  return (
    <section className="min-h-screen">
      <CompaniesHero
        searchInputs={searchInputs}
        onKeywordChange={(value) =>
          setSearchInputs((prev) => ({ ...prev, keyword: value }))
        }
        onLocationChange={(value) =>
          setSearchInputs((prev) => ({ ...prev, location: value }))
        }
        onSearch={handleSearch}
      />

      <section className="pb-8 sm:pb-12 lg:max-w-6xl mx-auto px-4">
        <CompaniesControls
          companiesCount={companies.length}
          totalCount={total}
          filters={filters}
          viewMode={viewMode}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
        />

        <CompaniesList
          loading={loading}
          companies={companies}
          viewMode={viewMode}
          page={page}
          filters={filters}
        />

        <CompaniesPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </section>
    </section>
  );
}
