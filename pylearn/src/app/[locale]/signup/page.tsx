"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl, setToken } from "@/lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl("/api/auth/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: displayName, email, password, role }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail ?? "Signup failed");
      }
      const { access_token } = await response.json();
      setToken(access_token);
      router.push(role === "teacher" ? "/teacher/classes" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-h2 text-ink-indigo">Create your account</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          required
          placeholder="Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="rounded-lg border border-ink-indigo/15 px-3 py-2 text-body"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-ink-indigo/15 px-3 py-2 text-body"
        />
        <input
          required
          type="password"
          minLength={8}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-ink-indigo/15 px-3 py-2 text-body"
        />

        <div className="flex gap-2 text-caption">
          {(["student", "teacher"] as const).map((r) => (
            <button
              type="button"
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 rounded-lg border px-3 py-2 font-medium capitalize ${
                role === r
                  ? "border-signal-blue bg-signal-blue/10 text-signal-blue"
                  : "border-ink-indigo/15 text-ink-indigo/50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {error && <p className="text-caption text-flag-coral">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-lg bg-signal-blue px-4 py-2.5 text-body font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Sign up"}
        </button>
      </form>
    </main>
  );
}
