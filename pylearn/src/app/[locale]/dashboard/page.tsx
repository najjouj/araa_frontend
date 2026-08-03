"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch, fetchCurrentUser, clearToken, type CurrentUser } from "@/lib/auth";

interface Progress {
  exercises_attempted: number;
  exercises_passed: number;
  xp_estimate: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const currentUser = await fetchCurrentUser();
      if (!currentUser) {
        router.push("/login");
        return;
      }
      setUser(currentUser);

      const response = await authFetch("/api/progress/me");
      if (response.ok) setProgress(await response.json());
      setLoading(false);
    }
    load();
  }, [router]);

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (loading) return null; // redirect-or-render race avoided by not flashing content

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 text-ink-indigo">Welcome back, {user?.display_name}</h1>
          <p className="text-caption text-ink-indigo/50">{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="text-caption text-ink-indigo/50 underline">
          Log out
        </button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-ink-indigo/10 p-4 text-center">
          <p className="text-display text-xp-amber">{progress?.xp_estimate ?? 0}</p>
          <p className="text-caption text-ink-indigo/50">XP</p>
        </div>
        <div className="rounded-xl border border-ink-indigo/10 p-4 text-center">
          <p className="text-display text-ink-indigo">{progress?.exercises_passed ?? 0}</p>
          <p className="text-caption text-ink-indigo/50">Exercises passed</p>
        </div>
        <div className="rounded-xl border border-ink-indigo/10 p-4 text-center">
          <p className="text-display text-ink-indigo">{progress?.exercises_attempted ?? 0}</p>
          <p className="text-caption text-ink-indigo/50">Attempted</p>
        </div>
      </div>

      <a
        href="../roadmap/beginner/lists/lists-intro"
        className="mt-8 inline-block rounded-lg bg-signal-blue px-4 py-2.5 text-body font-medium text-white"
      >
        Continue learning →
      </a>

      <a
        href="../join-class"
        className="mt-3 ml-3 inline-block text-caption font-medium text-signal-blue underline"
      >
        Join a class
      </a>
    </main>
  );
}
