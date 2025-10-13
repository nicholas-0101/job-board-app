"use client";

import HomePageLoading from "@/components/home/HomePageLoading";
import HeroSection from "@/components/home/HeroSection";
import JobsSection from "@/components/home/JobsSection";
import TrustedCompaniesSection from "@/components/home/TrustedCompaniesSection";
import { useHomePage } from "@/lib/hooks/useHomePage";

export default function HomePage() {
  const {
    jobs,
    mounted,
    hasAccess,
    keyword,
    setKeyword,
    selectedLocation,
    setSelectedLocation,
    handleSearch,
    exploreRef,
  } = useHomePage();

  if (!mounted || !hasAccess) {
    return <HomePageLoading />;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-secondary-50 to-background">
      <HeroSection
        keyword={keyword}
        setKeyword={setKeyword}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        onSearch={handleSearch}
      />

      <div ref={exploreRef}>
        <JobsSection jobs={jobs} />
      </div>

      <TrustedCompaniesSection />
    </section>
  );
}
