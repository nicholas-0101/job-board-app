export function Testimonials() {
  const items = [
    { name: "Ari", role: "Frontend Engineer", text: "ProHire helped me land my dream job in just two weeks!" },
    { name: "Nadia", role: "Recruiter", text: "Great pool of candidates and the interview tools are super handy." },
    { name: "Rizky", role: "Product Manager", text: "Clean UI and easy to use. Highly recommended." },
  ];
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-xl font-semibold mb-4">What people say</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((t, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card text-card-foreground p-6">
            <div className="text-sm text-foreground/80">“{t.text}”</div>
            <div className="mt-3 text-sm font-semibold text-foreground">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
