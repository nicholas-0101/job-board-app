export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Forgot password</h1>
      <form className="bg-white border rounded-2xl p-6 grid gap-4">
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
        </div>
        <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Send reset link</button>
      </form>
    </div>
  );
}
