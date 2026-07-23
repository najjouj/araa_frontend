import Link from "next/link";

// Placeholder landing page — the real one (marketing content, feature
// highlights, CTA) is a later content/design pass. This exists purely so
// /{locale} resolves to something instead of 404ing, and gives a working
// link into the one fully-built lesson from Phase 5.
export default function LocaleHome() {
  return (
    <main className="mx-auto max-w-2xl p-10 text-center">
      <h1 className="text-display text-ink-indigo">PyLearn</h1>
      <p className="mt-2 text-body text-ink-indigo/60">
        Confidence first. Code second.
      </p>
      <Link
        href="/roadmap/beginner/lists/lists-intro"
        className="mt-8 inline-block rounded-lg bg-signal-blue px-5 py-2.5 text-body font-medium text-white"
      >
        Try the sample lesson →
      </Link>

      <div className="mt-4 flex justify-center gap-4 text-caption">
        <Link href="/login" className="text-ink-indigo/50 underline">
          Log in
        </Link>
        <Link href="/signup" className="text-ink-indigo/50 underline">
          Sign up
        </Link>
      </div>
    </main>
  );
}
