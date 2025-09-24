export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-foreground tracking-tight">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <p className="mt-2 text-muted-foreground">The page you’re looking for doesn’t exist or has been moved.</p>
        <a href="/" className="inline-block mt-6 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Go home</a>
      </div>
    </div>
  );
}


