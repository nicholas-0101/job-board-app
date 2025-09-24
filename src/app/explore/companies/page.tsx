import { CompanyCard } from "../../../components/companies/CompanyCard";
import FilterSidebar from "@/components/jobboard/FilterSidebar";
import SearchBarPro from "@/components/jobboard/SearchBarPro";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";

const DUMMY = Array.from({ length: 9 }).map((_, i) => ({ id: i + 1, name: `Company ${i + 1}`, city: ["Jakarta","Bandung","Surabaya"][i%3], jobs: (i%4)+1 }));

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-8">
        <Container>
          <SearchBarPro />
        </Container>
      </section>
      <section className="pb-12">
        <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-9">
            <SectionHeader title="Companies" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {DUMMY.map((c) => (
                <CompanyCard key={c.id} {...c} />
              ))}
            </div>
          </div>
        </div>
        </Container>
      </section>
    </div>
  );
}
