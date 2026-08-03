"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl, setToken, fetchCurrentUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Incorrect email or password");
      }
      const { access_token } = await response.json();
      setToken(access_token);

      const user = await fetchCurrentUser();
      // An explicit redirect param (e.g. from the join-class page) wins;
      // otherwise send teachers and students to their respective home.
      router.push(redirectTo ?? (user?.role === "teacher" ? "/teacher/classes" : "/dashboard"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-h2 text-ink-indigo">Log in</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
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
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-ink-indigo/15 px-3 py-2 text-body"
        />

        {error && <p className="text-caption text-flag-coral">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-lg bg-signal-blue px-4 py-2.5 text-body font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </main>
  );
}
