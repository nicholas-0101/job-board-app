"use client";

export function ApplicantsHeader() {
  return (
    <div className="border-b bg-gradient-to-r from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Applicant Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and manage job applicants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


