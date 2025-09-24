"use client";
import { useState } from "react";

export function FilterBar({ onApply }: { onApply: (vals: { keyword?: string; category?: string; location?: string; sort?: string }) => void }) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  return (
    <div className="bg-white p-4 border rounded-xl grid gap-3 md:grid-cols-5">
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword" className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500">
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <button onClick={() => onApply({ keyword, category, location, sort })} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Apply</button>
    </div>
  );
}
