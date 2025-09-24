import Link from "next/link";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = { id: Number(params.id), name: `Company ${params.id}`, city: "Jakarta", about: "We build modern products." };
  return (
    <div className="container mx-auto px-4 py-10 grid gap-6">
      <div className="bg-white border rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">{company.name}</h1>
        <div className="text-sm text-gray-600">{company.city}</div>
        <p className="mt-3 text-gray-700">{company.about}</p>
      </div>
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Open Positions</h2>
          <Link href="/explore/jobs" className="text-blue-600 hover:underline">See all jobs</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1,2,3].map((i) => (
            <Link key={i} href={`/explore/jobs/${i}`} className="block bg-white border rounded-2xl p-5 hover:shadow-md transition">
              <div className="font-semibold">Frontend Engineer</div>
              <div className="text-sm text-gray-600">{company.name} • {company.city}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
