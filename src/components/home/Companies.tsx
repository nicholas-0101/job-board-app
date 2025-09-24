export function Companies() {
  const items = [
    { name: "TechNova", city: "Jakarta" },
    { name: "Cloudify", city: "Bandung" },
    { name: "DesignHub", city: "Surabaya" },
    { name: "Finverse", city: "Jakarta" },
  ];
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Featured Companies</h2>
        <a href="/explore/companies" className="text-blue-600 hover:underline text-sm">See all</a>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {items.map((c) => (
          <div key={c.name} className="rounded-2xl border border-border bg-card text-card-foreground p-5 hover:shadow-sm">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-muted-foreground">{c.city}</div>
            <button className="mt-3 text-sm px-3 py-1.5 rounded-md border border-border hover:bg-secondary">View</button>
          </div>
        ))}
      </div>
    </section>
  );
}
