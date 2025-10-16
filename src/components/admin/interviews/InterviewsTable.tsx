"use client";

interface InterviewItemDTO {
  id: number;
  applicationId: number;
  scheduleDate: string;
  locationOrLink?: string | null;
  notes?: string | null;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
  candidateName: string;
  jobTitle: string;
}

interface InterviewsTableProps {
  items: InterviewItemDTO[];
  onEdit: (interview: InterviewItemDTO) => void;
  onCancel: (id: number) => void;
}

export default function InterviewsTable({ items, onEdit, onCancel }: InterviewsTableProps) {
  return (
    <div className="bg-card rounded-xl shadow-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
            <tr>
              <th className="text-left p-4 font-semibold text-foreground">Candidate</th>
              <th className="text-left p-4 font-semibold text-foreground">Job</th>
              <th className="text-left p-4 font-semibold text-foreground">Schedule</th>
              <th className="text-left p-4 font-semibold text-foreground">Status</th>
              <th className="text-left p-4 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-primary-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7]"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-foreground mb-1">No interviews scheduled</p>
                      <p className="text-muted-foreground">Create interview schedules using the form above</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{it.candidateName}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">{it.jobTitle}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {new Date(it.scheduleDate).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4">
                    {it.status === 'SCHEDULED' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                        📅 Scheduled
                      </span>
                    )}
                    {it.status === 'COMPLETED' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                        ✓ Completed
                      </span>
                    )}
                    {it.status === 'CANCELLED' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 text-red-700 font-medium">
                        ✕ Cancelled
                      </span>
                    )}
                    {it.status === 'NO_SHOW' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 font-medium">
                        No Show
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onEdit(it)} 
                        className="px-3 py-1.5 text-sm border border-blue-300 rounded-xl hover:bg-blue-50 text-blue-600 transition-colors flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Edit
                      </button>
                      <button 
                        onClick={() => onCancel(it.id)} 
                        className="px-3 py-1.5 text-sm border border-red-300 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
