"use client";

import Container from "@/components/common/Container";

export default function JobApplicationLoading() {
  return (
    <div className="min-h-screen bg-background py-20">
      <Container className="py-10 max-w-2xl">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#24CFA7] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Checking requirements...</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
