"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface CodeExercisePaneProps {
  starterCode: string;
  /** Called with the current editor contents when the student runs their code. */
  onRun: (code: string) => Promise<{ passing: number; total: number }>;
}

/**
 * The code editor, its output, and the "run" action. Per Phase 3's RTL
 * nuance and Phase 4's design thesis, this entire pane stays dir="ltr"
 * even on the Arabic site — only the surrounding chrome (prose, buttons'
 * label text) is localized. Submissions are sent to the API, which queues
 * them to the sandbox execution service (Phase 3, Section 1) rather than
 * running untrusted code in the browser.
 */
export function CodeExercisePane({ starterCode, onRun }: CodeExercisePaneProps) {
  const t = useTranslations("lessonView");
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<{ passing: number; total: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  async function handleRun() {
    setIsRunning(true);
    try {
      const outcome = await onRun(code);
      setResult(outcome);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <div>
      <div
        dir="ltr"
        className="rounded-lg bg-paper-dark p-4 font-mono text-caption leading-7 text-[#D6D4EC]"
      >
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          rows={6}
          className="w-full resize-none border-none bg-transparent text-start outline-none"
          aria-label="Code editor"
        />
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="rounded-lg bg-signal-blue px-4 py-2 text-caption font-medium text-white disabled:opacity-60"
        >
          {t("runCode")}
        </button>
        {result && (
          <span className="text-caption text-ink-indigo/60">
            {t("testsPassing", { passing: result.passing, total: result.total })}
          </span>
        )}
      </div>
    </div>
  );
}
