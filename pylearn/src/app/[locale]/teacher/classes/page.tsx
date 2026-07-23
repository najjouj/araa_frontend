"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch, fetchCurrentUser, clearToken } from "@/lib/auth";

interface SchoolClass {
  id: string;
  name: string;
  join_code: string;
  student_count: number;
}

interface RosterEntry {
  student_id: string;
  display_name: string;
  email: string;
  exercises_attempted: number;
  exercises_passed: number;
}

export default function TeacherClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [newClassName, setNewClassName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const user = await fetchCurrentUser();
      // Role gate: a student who lands here gets redirected rather than
      // shown an empty/broken teacher UI.
      if (!user) {
        router.push("/login");
        return;
      }
      if (user.role !== "teacher" && user.role !== "admin") {
        router.push("/dashboard");
        return;
      }
      await refreshClasses();
      setLoading(false);
    }
    load();
  }, [router]);

  async function refreshClasses() {
    const response = await authFetch("/api/classes");
    if (response.ok) setClasses(await response.json());
  }

  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newClassName.trim()) return;
    const response = await authFetch("/api/classes", {
      method: "POST",
      body: JSON.stringify({ name: newClassName }),
    });
    if (response.ok) {
      setNewClassName("");
      await refreshClasses();
    }
  }

  async function viewRoster(classId: string) {
    setSelectedClassId(classId);
    const response = await authFetch(`/api/classes/${classId}/roster`);
    setRoster(response.ok ? await response.json() : []);
  }

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  if (loading) return null;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-h2 text-ink-indigo">Your classes</h1>
        <button onClick={handleLogout} className="text-caption text-ink-indigo/50 underline">
          Log out
        </button>
      </div>

      <form onSubmit={handleCreateClass} className="mt-6 flex gap-2">
        <input
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="New class name (e.g. Period 3 — Intro to Python)"
          className="flex-1 rounded-lg border border-ink-indigo/15 px-3 py-2 text-body"
        />
        <button
          type="submit"
          className="rounded-lg bg-signal-blue px-4 py-2 text-body font-medium text-white"
        >
          Create
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2">
        {classes.map((c) => (
          <div key={c.id} className="rounded-xl border border-ink-indigo/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-h3 text-ink-indigo">{c.name}</p>
                <p className="text-caption text-ink-indigo/50">
                  Join code: <span className="font-mono">{c.join_code}</span> ·{" "}
                  {c.student_count} student{c.student_count === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={() => viewRoster(c.id)}
                className="text-caption font-medium text-signal-blue"
              >
                View roster
              </button>
            </div>

            {selectedClassId === c.id && roster && (
              <table className="mt-4 w-full text-caption">
                <thead>
                  <tr className="text-start text-ink-indigo/40">
                    <th className="pb-1 text-start">Student</th>
                    <th className="pb-1 text-start">Passed</th>
                    <th className="pb-1 text-start">Attempted</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="pt-2 text-ink-indigo/40">
                        No students enrolled yet — share the join code above.
                      </td>
                    </tr>
                  ) : (
                    roster.map((r) => (
                      <tr key={r.student_id} className="border-t border-ink-indigo/5">
                        <td className="py-1.5">{r.display_name}</td>
                        <td className="py-1.5">{r.exercises_passed}</td>
                        <td className="py-1.5">{r.exercises_attempted}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
