export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-2xl border bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-10 text-white grid md:grid-cols-2 items-center gap-6">
        <div>
          <div className="text-xl font-semibold">Stay updated</div>
          <p className="mt-1 text-blue-100">Get weekly curated jobs and hiring tips straight to your inbox.</p>
        </div>
        <form className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="px-3 py-2 rounded-lg text-gray-900" placeholder="Your email" />
          <button className="px-4 py-2 rounded-lg bg-white text-blue-700 font-medium">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
