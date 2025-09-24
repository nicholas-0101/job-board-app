export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-[240px_1fr]">
      <aside className="bg-white border rounded-2xl p-4 h-fit sticky top-24">
        <div className="font-semibold mb-3">Admin</div>
        <ul className="space-y-2 text-sm">
          <li><a href="#jobs" className="hover:text-blue-600">Jobs</a></li>
          <li><a href="#applicants" className="hover:text-blue-600">Applicants</a></li>
          <li><a href="#interviews" className="hover:text-blue-600">Interviews</a></li>
        </ul>
      </aside>
      <section>{children}</section>
    </div>
  );
}
