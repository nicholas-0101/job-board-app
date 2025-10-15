interface InterviewFiltersProps {
  filters: {
    jobId: string;
    applicantId: string;
    status: string;
    dateFrom: string;
    dateTo: string;
  };
  limit: number;
  onFiltersChange: (filters: any) => void;
  onLimitChange: (limit: number) => void;
}

export function InterviewFilters({ filters, limit, onFiltersChange, onLimitChange }: InterviewFiltersProps) {
  return (
    <div className="bg-card rounded-xl shadow-md border p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        Filters
      </h3>
      <div className="grid gap-3 md:grid-cols-6">
        <input value={filters.jobId} onChange={(e) => onFiltersChange({ ...filters, jobId: e.target.value })} placeholder="Job ID" className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
        <input value={filters.applicantId} onChange={(e) => onFiltersChange({ ...filters, applicantId: e.target.value })} placeholder="Applicant ID" className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
        <select value={filters.status} onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
          <option value="">Any Status</option>
          {['SCHEDULED','COMPLETED','CANCELLED','NO_SHOW'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={filters.dateFrom} onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
        <input type="date" value={filters.dateTo} onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors" />
        <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))} className="px-3 py-2 border rounded-xl bg-background hover:border-primary transition-colors">
          {[5,10,20,50].map((n) => <option key={n} value={n}>{n} per page</option>)}
        </select>
      </div>
    </div>
  );
}

