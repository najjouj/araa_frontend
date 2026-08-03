"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch, fetchCurrentUser } from "@/lib/auth";

export default function JoinClassPage() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const user = await fetchCurrentUser();
      if (!user) {
        router.push("/login");
        return;
      }
      // Teachers create classes, they don't join them as a student would —
      // send them to their own dashboard instead of a confusing form.
      if (user.role === "teacher" || user.role === "admin") {
        router.push("/teacher/classes");
        return;
      }
      setCheckingAuth(false);
    }
    checkAuth();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setStatus("submitting");
    setMessage(null);

    try {
      const response = await authFetch("/api/classes/join", {
        method: "POST",
        body: JSON.stringify({ join_code: joinCode.trim().toUpperCase() }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail ?? "Couldn't join that class");
      }

      const data = await response.json();
      setStatus("success");
      setMessage(`You've joined ${data.joined}!`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (checkingAuth) return null;

  return (
    <main className="mx-auto max-w-sm p-8">
      <h1 className="text-h2 text-ink-indigo">Join a class</h1>
      <p className="mt-1 text-caption text-ink-indigo/50">
        Ask your teacher for the class join code.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
        <input
          required
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          placeholder="e.g. 7K3M9P"
          maxLength={6}
          className="rounded-lg border border-ink-indigo/15 px-3 py-2 text-center font-mono text-h3 tracking-widest uppercase"
        />

        {message && (
          <p
            className={`text-caption ${
              status === "success" ? "text-spine-teal" : "text-flag-coral"
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 rounded-lg bg-signal-blue px-4 py-2.5 text-body font-medium text-white disabled:opacity-60"
        >
          {status === "submitting" ? "Joining…" : "Join class"}
        </button>
      </form>

      {status === "success" && (
        <a
          href="../dashboard"
          className="mt-4 inline-block text-caption font-medium text-signal-blue underline"
        >
          Go to your dashboard →
        </a>
      )}
    </main>
  );
}
