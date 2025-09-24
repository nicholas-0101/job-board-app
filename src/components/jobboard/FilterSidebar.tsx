"use client";
import { useState } from "react";
import { Filter } from "lucide-react";

export default function FilterSidebar() {
  const [open, setOpen] = useState(false);
  return (
    <aside className="md:sticky md:top-20">
      {/* Mobile trigger */}
      <button
    className="md:hidden w-full mb-3 px-4 py-2 rounded-xl border border-border text-foreground/80 flex items-center justify-between"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-medium">Filters</span>
        <Filter className="w-4 h-4" />
      </button>

  <div className={`rounded-2xl border border-border bg-card text-card-foreground p-4 ${open ? "block" : "hidden md:block"}`}>
        <div className="mb-4">
      <p className="text-sm font-semibold text-foreground mb-2">Job Type</p>
      <div className="grid gap-2 text-sm text-foreground/80">
            <label className="flex items-center gap-2"><input type="checkbox" /> Full-time</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Part-time</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Contract</label>
            <label className="flex items-center gap-2"><input type="checkbox" /> Remote</label>
          </div>
        </div>
        <div className="mb-4">
      <p className="text-sm font-semibold text-foreground mb-2">Experience</p>
      <div className="grid gap-2 text-sm text-foreground/80">
            <label className="flex items-center gap-2"><input type="radio" name="exp" /> Junior</label>
            <label className="flex items-center gap-2"><input type="radio" name="exp" /> Mid</label>
            <label className="flex items-center gap-2"><input type="radio" name="exp" /> Senior</label>
          </div>
        </div>
        <div>
      <button className="w-full px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">Apply Filters</button>
        </div>
      </div>
    </aside>
  );
}


