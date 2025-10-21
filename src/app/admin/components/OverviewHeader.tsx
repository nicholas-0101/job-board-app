"use client";

export function OverviewHeader({
  companyInfo,
}: {
  companyInfo: any;
}) {
  return (
    <header className="space-y-4 rounded-3xl border bg-white/70 px-4 py-6 shadow-sm backdrop-blur sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:max-w-2xl">
            Manage your job board platform with real-time stats, recent activity, and quick actions.
          </p>
        </div>
      </div>
    </header>
  );
}


