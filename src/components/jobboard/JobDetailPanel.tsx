import Link from "next/link";
import { Bookmark, Share2, MapPin, Building2, Clock } from "lucide-react";

type Props = {
  title: string;
  company: string;
  city: string;
  description: string;
  id: number | string;
};

export default function JobDetailPanel({ title, company, city, description, id }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {city}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Recently</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-xl border text-sm text-gray-700 hover:bg-gray-50"><Bookmark className="w-4 h-4" /></button>
          <button className="px-3 py-2 rounded-xl border text-sm text-gray-700 hover:bg-gray-50"><Share2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-gray-700 mt-4">
        <p>{description}</p>
      </div>

      <div className="mt-6 flex gap-3">
        <Link href={`/explore/jobs/${id}`} className="px-5 py-3 rounded-xl bg-[#0D6EFD] text-white font-medium shadow-sm hover:opacity-90">Apply Now</Link>
        <Link href={`/explore/companies/${company}`} className="px-5 py-3 rounded-xl border text-gray-700 hover:bg-gray-50">Company Profile</Link>
      </div>
    </div>
  );
}


