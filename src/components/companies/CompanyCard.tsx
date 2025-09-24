import Link from "next/link";

export function CompanyCard(props: { id: number; name: string; city?: string; jobs?: number }) {
  const { id, name, city = "Unknown", jobs = 0 } = props;
  return (
    <Link href={`/explore/companies/${id}`} className="block bg-white border rounded-2xl p-5 hover:shadow-md transition">
      <div className="font-semibold text-gray-900">{name}</div>
      <div className="text-sm text-gray-600">{city}</div>
      <div className="mt-2 text-xs text-gray-500">{jobs} open jobs</div>
    </Link>
  );
}
