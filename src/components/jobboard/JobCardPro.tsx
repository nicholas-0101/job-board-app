import Link from "next/link";

type Props = {
  id: number | string;
  title: string;
  company: string;
  city: string;
  tags?: string[];
  posted?: string;
  salary?: string;
};

export default function JobCardPro({ id, title, company, city, tags = [], posted, salary }: Props) {
  return (
    <Link href={`/explore/jobs/${id}`} className="block rounded-2xl border border-gray-200 bg-white p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{company} • {city}</p>
        </div>
        {posted && <span className="text-xs text-gray-500">{posted}</span>}
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs">{t}</span>
          ))}
        </div>
      )}
      {salary && <div className="mt-3 text-sm font-medium text-green-600">{salary}</div>}
    </Link>
  );
}


