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
  <div className="rounded-2xl border border-border bg-card text-card-foreground p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {company}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {city}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Recently</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
      <button className="px-3 py-2 rounded-xl border text-sm text-foreground/80 hover:bg-secondary"><Bookmark className="w-4 h-4" /></button>
      <button className="px-3 py-2 rounded-xl border text-sm text-foreground/80 hover:bg-secondary"><Share2 className="w-4 h-4" /></button>
        </div>
      </div>

    <div className="prose prose-sm max-w-none text-foreground/80 mt-4">
        <p>{description}</p>
      </div>

      <div className="mt-6 flex gap-3">
    <Link href={`/explore/jobs/${id}`} className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-sm hover:opacity-90">Apply Now</Link>
    <Link href={`/explore/companies/${company}`} className="px-5 py-3 rounded-xl border text-foreground/80 hover:bg-secondary">Company Profile</Link>
      </div>
    </div>
  );
}


