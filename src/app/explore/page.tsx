import Link from "next/link";

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-12 grid gap-6">
      <h1 className="text-2xl font-semibold">Explore</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/explore/jobs" className="rounded-2xl border bg-white p-6 hover:shadow-sm">
          <div className="text-lg font-semibold">Browse Jobs</div>
          <div className="text-sm text-gray-600">Find your next opportunity</div>
        </Link>
        <Link href="/explore/companies" className="rounded-2xl border bg-white p-6 hover:shadow-sm">
          <div className="text-lg font-semibold">Companies</div>
          <div className="text-sm text-gray-600">Discover hiring companies</div>
        </Link>
      </div>
    </div>
  );
}
