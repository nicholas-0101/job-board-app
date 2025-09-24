"use client";
import { useState } from "react";
import Container from "@/components/common/Container";

export default function SignUpPage() {
  const [tab, setTab] = useState<"seeker" | "admin">("seeker");
  return (
    <Container className="py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Create an account</h1>
      <div className="bg-background border border-border rounded-2xl">
        <div className="flex">
          <button onClick={() => setTab("seeker")} className={`flex-1 px-4 py-3 text-sm font-medium ${tab === "seeker" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>Job Seeker</button>
          <button onClick={() => setTab("admin")} className={`flex-1 px-4 py-3 text-sm font-medium ${tab === "admin" ? "border-b-2 border-primary text-primary" : "text-muted-foreground"}`}>Company Admin</button>
        </div>
        <div className="p-6 grid gap-4">
          {tab === "seeker" ? (
            <>
              <div>
                <label className="text-sm text-muted-foreground">Full name</label>
                <input className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Password</label>
                <input type="password" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-95">Create account</button>
            </>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm text-muted-foreground">Company name</label>
                  <input className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">City</label>
                  <input className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Admin email</label>
                <input type="email" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Password</label>
                <input type="password" className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-95">Create company admin</button>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}
