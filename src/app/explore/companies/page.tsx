import { CompanyCard } from "./components/CompanyCard";
import SearchBarPro from "@/components/site/SearchBar";

const DUMMY = Array.from({ length: 9 }).map((_, i) => ({ id: i + 1, name: `Company ${i + 1}`, city: ["Jakarta","Bandung","Surabaya"][i%3], jobs: (i%4)+1 }));

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 lg:max-w-6xl mx-auto">
  
          {/* <SearchBarPro /> */}

      </section>
      <section className="pb-12 lg:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-9">
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
