"use client";
import { Button } from "@/components/ui/button";

export function ApplicantsPagination({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <Button
        variant="outline"
        disabled={page <= 1}
        onClick={onPrev}
        className="hover:bg-[#467EC7] hover:text-white transition-colors rounded-xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6" /></svg>
        Prev
      </Button>
      <div className="px-4 py-2 bg-secondary rounded-xl">
        <span className="font-medium">Page {page}</span>
        <span className="text-muted-foreground"> of {totalPages}</span>
      </div>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={onNext}
        className="hover:bg-[#467EC7] hover:text-white transition-colors rounded-xl"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="m9 18 6-6-6-6" /></svg>
      </Button>
    </div>
  );
}


