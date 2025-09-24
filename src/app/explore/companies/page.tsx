import { CompanyCard } from "../../../components/companies/CompanyCard";

const DUMMY = Array.from({ length: 9 }).map((_, i) => ({ id: i + 1, name: `Company ${i + 1}`, city: ["Jakarta","Bandung","Surabaya"][i%3], jobs: (i%4)+1 }));

export default function CompaniesPage() {
  return (
    <div className="container mx-auto px-4 py-10 grid gap-6">
      <h1 className="text-2xl font-semibold">Companies</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {DUMMY.map((c) => (
          <CompanyCard key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
