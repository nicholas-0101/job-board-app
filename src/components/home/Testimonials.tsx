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
          <div key={i} className="rounded-2xl border bg-white p-6">
            <div className="text-sm text-gray-700">“{t.text}”</div>
            <div className="mt-3 text-sm font-semibold text-gray-900">{t.name}</div>
            <div className="text-xs text-gray-500">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
