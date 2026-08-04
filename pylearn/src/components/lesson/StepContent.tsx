"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Content components for the 13 lesson-step types beyond Coding Exercise
 * (which already has its own dedicated CodeExercisePane). Each component
 * pulls its copy from messages/{locale}.json under
 * lessons.{lessonId}.steps.{stepKey} — see LessonView.tsx for how lessonId
 * is threaded through via the translation namespace.
 *
 * Code snippets inside any step (via <code> or the dedicated code blocks
 * below) are never passed through translation — they're identical in both
 * locales, per the "code always stays LTR/English" rule established in
 * Phase 4.
 */

const codeBlockClass =
  "rounded-lg bg-paper-dark px-4 py-3 font-mono text-caption leading-6 text-[#D6D4EC]";

export function MotivationStep() {
  const t = useTranslations("lessons.lists-intro.steps.motivation");
  return <p className="text-body leading-7 text-ink-indigo/80">{t("body")}</p>;
}

export function ExplanationStep() {
  const t = useTranslations("lessons.lists-intro.steps.explanation");
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body leading-7 text-ink-indigo/80">{t("body")}</p>
      <pre dir="ltr" className={codeBlockClass}>
        {t("codeExample")}
      </pre>
    </div>
  );
}

export function IllustrationStep() {
  const t = useTranslations("lessons.lists-intro.steps.illustration");
  const boxes = ["bread", "milk", "eggs"];
  return (
    <div className="flex flex-col items-center gap-4">
      <div dir="ltr" className="flex gap-2">
        {boxes.map((item, i) => (
          <div key={item} className="flex flex-col items-center">
            <div className="flex h-16 w-20 items-center justify-center rounded-lg border-2 border-signal-blue bg-signal-blue/5 font-mono text-caption text-ink-indigo">
              "{item}"
            </div>
            <span className="mt-1 font-mono text-caption text-ink-indigo/40">{i}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-caption text-ink-indigo/60">{t("caption")}</p>
    </div>
  );
}

export function VideoStep() {
  const t = useTranslations("lessons.lists-intro.steps.video");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-ink-indigo/15 bg-paper">
        <div className="text-center">
          <p className="text-h3 text-ink-indigo">{t("title")}</p>
          <p className="mt-1 text-caption text-ink-indigo/40">{t("duration")}</p>
        </div>
      </div>
      <p className="text-caption text-ink-indigo/50">{t("comingSoon")}</p>
    </div>
  );
}

export function ExamplesStep() {
  const t = useTranslations("lessons.lists-intro.steps");
  const examples = t.raw("examples") as { code: string; output: string; note: string }[];
  return (
    <div className="flex flex-col gap-4">
      {examples.map((ex, i) => (
        <div key={i} className="rounded-lg border border-ink-indigo/10 p-4">
          <pre dir="ltr" className={codeBlockClass}>
            {ex.code}
          </pre>
          <p dir="ltr" className="mt-2 font-mono text-caption text-spine-teal">
            → {ex.output}
          </p>
          <p className="mt-2 text-caption text-ink-indigo/60">{ex.note}</p>
        </div>
      ))}
    </div>
  );
}

export function GuidedPracticeStep() {
  const t = useTranslations("lessons.lists-intro.steps");
  const steps = t.raw("guidedPractice.steps") as string[];
  return (
    <ol className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal-blue/10 text-caption font-medium text-signal-blue">
            {i + 1}
          </span>
          <p
            className="text-body text-ink-indigo/80"
            dangerouslySetInnerHTML={{ __html: step }}
          />
        </li>
      ))}
    </ol>
  );
}

export function QuizStep() {
  const t = useTranslations("lessons.lists-intro.steps.quiz");
  const options = t.raw("options") as string[];
  const correctIndex = t.raw("correctIndex") as number;
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <p
        className="text-body font-medium text-ink-indigo"
        dangerouslySetInnerHTML={{ __html: t.raw("question") }}
      />
      <div className="flex flex-col gap-2">
        {options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correctIndex;
          const showResult = selected !== null;
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              disabled={showResult}
              className={`rounded-lg border px-4 py-2.5 text-start text-body transition-colors ${
                showResult && isCorrect
                  ? "border-spine-teal bg-spine-teal/10 text-spine-teal"
                  : showResult && isSelected
                  ? "border-flag-coral bg-flag-coral/10 text-flag-coral"
                  : "border-ink-indigo/15 text-ink-indigo/80 hover:border-signal-blue/40"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <p className="text-caption text-ink-indigo/60">{t("explanation")}</p>
      )}
    </div>
  );
}

export function ChallengeStep() {
  const t = useTranslations("lessons.lists-intro.steps.challenge");
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body text-ink-indigo/80">{t("prompt")}</p>
      <pre dir="ltr" className={codeBlockClass}>
        {t("starterCode")}
      </pre>
      <p className="text-caption text-ink-indigo/40">{t("note")}</p>
    </div>
  );
}

export function MiniProjectStep() {
  const t = useTranslations("lessons.lists-intro.steps.miniProject");
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-h3 text-ink-indigo">{t("title")}</h2>
      <p className="text-body text-ink-indigo/80">{t("brief")}</p>
      <p className="rounded-lg border border-dashed border-ink-indigo/15 p-3 text-caption text-ink-indigo/50">
        {t("note")}
      </p>
    </div>
  );
}

export function SummaryStep() {
  const t = useTranslations("lessons.lists-intro.steps");
  const points = t.raw("summary.points") as string[];
  return (
    <ul className="flex flex-col gap-2">
      {points.map((point, i) => (
        <li key={i} className="flex gap-2 text-body text-ink-indigo/80">
          <span className="text-spine-teal">✓</span>
          <span>{point}</span>
        </li>
      ))}
    </ul>
  );
}

export function CheatSheetStep() {
  const t = useTranslations("lessons.lists-intro.steps");
  const rows = t.raw("cheatSheet.rows") as { op: string; desc: string }[];
  return (
    <table className="w-full text-body">
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-ink-indigo/5 last:border-0">
            <td dir="ltr" className="py-2 pe-4 font-mono text-caption text-spine-teal">
              {row.op}
            </td>
            <td className="py-2 text-ink-indigo/70">{row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function MistakesStep() {
  const t = useTranslations("lessons.lists-intro.steps");
  const items = t.raw("commonMistakes.items") as { title: string; body: string }[];
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-flag-coral/20 bg-flag-coral/5 p-3">
          <p className="text-body font-medium text-flag-coral">{item.title}</p>
          <p
            className="mt-1 text-caption text-ink-indigo/70"
            dangerouslySetInnerHTML={{ __html: item.body }}
          />
        </div>
      ))}
    </div>
  );
}

export function BestPracticesStep() {
  const t = useTranslations("lessons.lists-intro.steps");
  const items = t.raw("bestPractices.items") as string[];
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-body text-ink-indigo/80">
          <span className="text-xp-amber">★</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
