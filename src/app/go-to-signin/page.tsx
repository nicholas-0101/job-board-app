export default function GoToSignin() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#467EC7] tracking-tight">Sign In</h1>
        <p className="mt-2 text-lg text-muted-foreground">Please sign in to access this page</p>
        <a href="/auth/signin" className="inline-block mt-6 px-6 py-3 rounded-xl bg-[#24cfa7] text-primary-foreground font-semibold">Sign In Now</a>
      </div>
    </div>
  );
}
