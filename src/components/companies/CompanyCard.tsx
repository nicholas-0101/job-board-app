import Link from "next/link";

export function CompanyCard(props: { id: number; name: string; city?: string; jobs?: number }) {
  const { id, name, city = "Unknown", jobs = 0 } = props;
  return (
    <Link href={`/explore/companies/${id}`} className="block bg-card text-card-foreground border border-border rounded-2xl p-5 hover:shadow-md transition">
      <div className="font-semibold text-foreground">{name}</div>
      <div className="text-sm text-muted-foreground">{city}</div>
      <div className="mt-2 text-xs text-muted-foreground">{jobs} open jobs</div>
    </Link>
  );
}
