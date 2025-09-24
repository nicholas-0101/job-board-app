import Link from "next/link";
import FilterSidebar from "@/components/jobboard/FilterSidebar";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = { id: Number(params.id), name: `Company ${params.id}`, city: "Jakarta", about: "We build modern products." };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{company.name}</h1>
              <div className="text-sm text-gray-600">{company.city}</div>
              <p className="mt-3 text-gray-700">{company.about}</p>
            </div>
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Open Positions</h2>
                <Link href="/explore/jobs" className="text-[#0D6EFD] hover:opacity-80">See all jobs</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {[1,2,3].map((i) => (
                  <Link key={i} href={`/explore/jobs/${i}`} className="block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                    <div className="font-semibold text-gray-900">Frontend Engineer</div>
                    <div className="text-sm text-gray-600">{company.name} • {company.city}</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
