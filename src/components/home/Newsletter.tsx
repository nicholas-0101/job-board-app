export function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="rounded-2xl border border-border bg-gradient-to-r from-primary to-secondary p-6 md:p-10 text-primary-foreground grid md:grid-cols-2 items-center gap-6">
        <div>
          <div className="text-xl font-semibold">Stay updated</div>
          <p className="mt-1 text-blue-100">Get weekly curated jobs and hiring tips straight to your inbox.</p>
        </div>
        <form className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="px-3 py-2 rounded-lg text-foreground" placeholder="Your email" />
          <button className="px-4 py-2 rounded-lg bg-background text-primary font-medium">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
