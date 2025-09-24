export function HowItWorks() {
  const steps = [
    { t: "Create Profile", d: "Build a standout profile and upload your resume.", n: 1 },
    { t: "Browse & Apply", d: "Find curated jobs and apply in one click.", n: 2 },
    { t: "Interview & Offer", d: "Schedule interviews and get hired.", n: 3 },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-xl font-semibold mb-4">How it works</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="rounded-2xl border border-border bg-card text-card-foreground p-6">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center font-bold">{s.n}</div>
            <div className="mt-3 font-semibold text-foreground">{s.t}</div>
            <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
