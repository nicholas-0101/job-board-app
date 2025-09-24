"use client";
import { useState } from "react";

export default function SignUpPage() {
  const [tab, setTab] = useState<"seeker" | "admin">("seeker");
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
      <div className="bg-white border rounded-2xl">
        <div className="flex">
          <button onClick={() => setTab("seeker")} className={`flex-1 px-4 py-3 text-sm font-medium ${tab === "seeker" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Job Seeker</button>
          <button onClick={() => setTab("admin")} className={`flex-1 px-4 py-3 text-sm font-medium ${tab === "admin" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-600"}`}>Company Admin</button>
        </div>
        <div className="p-6 grid gap-4">
          {tab === "seeker" ? (
            <>
              <div>
                <label className="text-sm text-gray-600">Full name</label>
                <input className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input type="password" className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create account</button>
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-gray-600">Company name</label>
                  <input className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">City</label>
                  <input className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600">Admin email</label>
                <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Password</label>
                <input type="password" className="mt-1 w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <button className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Create company admin</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
