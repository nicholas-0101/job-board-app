import Link from "next/link";
import FilterSidebar from "@/components/jobboard/FilterSidebar";
import Container from "@/components/common/Container";
import SectionHeader from "@/components/common/SectionHeader";

export default function CompanyDetailPage({ params }: { params: { id: string } }) {
  const company = { id: Number(params.id), name: `Company ${params.id}`, city: "Jakarta", about: "We build modern products." };
  return (
    <div className="min-h-screen bg-background">
      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
            <FilterSidebar />
          </div>
          <div className="lg:col-span-9">
            <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 mb-6">
              <h1 className="text-2xl font-semibold text-foreground">{company.name}</h1>
              <div className="text-sm text-muted-foreground">{company.city}</div>
              <p className="mt-3 text-foreground/80">{company.about}</p>
            </div>
            <section>
              <SectionHeader title="Open Positions" right={<Link href="/explore/jobs" className="text-primary hover:opacity-80">See all jobs</Link>} />
              <div className="grid gap-4 md:grid-cols-3">
                {[1,2,3].map((i) => (
                  <Link key={i} href={`/explore/jobs/${i}`} className="block bg-card text-card-foreground border border-border rounded-2xl p-5 hover:shadow-md transition">
                    <div className="font-semibold text-foreground">Frontend Engineer</div>
                    <div className="text-sm text-muted-foreground">{company.name} • {company.city}</div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
