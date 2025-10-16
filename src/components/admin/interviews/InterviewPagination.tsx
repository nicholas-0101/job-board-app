"use client";

interface InterviewPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function InterviewPagination({ page, totalPages, onPageChange }: InterviewPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button 
        disabled={page <= 1} 
        onClick={() => onPageChange(Math.max(1, page - 1))} 
        className="px-4 py-2 border rounded-xl hover:bg-[#467EC7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Prev
      </button>
      <div className="px-4 py-2 bg-secondary rounded-xl">
        <span className="font-medium">Page {page}</span>
        <span className="text-muted-foreground"> of {totalPages}</span>
      </div>
      <button 
        disabled={page >= totalPages} 
        onClick={() => onPageChange(Math.min(totalPages, page + 1))} 
        className="px-4 py-2 border rounded-xl hover:bg-[#467EC7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  );
}
