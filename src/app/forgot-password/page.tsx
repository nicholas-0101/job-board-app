export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Forgot password</h1>
      <form className="bg-background border border-border rounded-2xl p-6 grid gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Email</label>
          <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
        </div>
        <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:opacity-95">Send reset link</button>
      </form>
    </div>
  );
}
