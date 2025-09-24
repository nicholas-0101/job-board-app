import { CompanyCard } from "../../../components/companies/CompanyCard";
import FilterSidebar from "@/components/jobboard/FilterSidebar";
import SearchBarPro from "@/components/jobboard/SearchBarPro";

const DUMMY = Array.from({ length: 9 }).map((_, i) => ({ id: i + 1, name: `Company ${i + 1}`, city: ["Jakarta","Bandung","Surabaya"][i%3], jobs: (i%4)+1 }));

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="container mx-auto px-4 py-6">
        <SearchBarPro />
      </section>
      <section className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {DUMMY.map((c) => (
                <CompanyCard key={c.id} {...c} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
