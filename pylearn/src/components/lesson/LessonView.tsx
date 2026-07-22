"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { StepRail, LESSON_STEP_ORDER, type LessonStepKey } from "./StepRail";
import { CodeSpine } from "./CodeSpine";
import { CodeExercisePane } from "./CodeExercisePane";

interface LessonViewProps {
  lessonId: string;
  starterCode: string;
  spineSnippets: string[];
}

/**
 * Top-level lesson screen (Phase 4 mockup). Composes the step rail, the
 * atmospheric code spine, and the active step's content. Only the
 * coding-exercise step is wired up here as the representative slice for
 * Phase 5 — the other 13 step types follow the same content-swap pattern
 * and are straightforward additions once this shell is approved.
 */
export function LessonView({ lessonId, starterCode, spineSnippets }: LessonViewProps) {
  const t = useTranslations("lessonView");
  const tLesson = useTranslations(`lessons.${lessonId}`);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [activeStep, setActiveStep] = useState<LessonStepKey>("codingExercise");
  const [completedSteps] = useState<LessonStepKey[]>([
    "motivation",
    "explanation",
    "illustration",
    "video",
    "interactiveExamples",
    "guidedPractice",
  ]);

  const stepIndex = LESSON_STEP_ORDER.indexOf(activeStep) + 1;

  function switchLocale(nextLocale: "en" | "ar") {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  }

  async function handleRun(code: string) {
    // NEXT_PUBLIC_API_URL points at the deployed FastAPI backend (Railway/
    // Render) — see DEPLOYMENT.md Step 5. Falls back to localhost so
    // `npm run dev` still works against a locally running backend.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    const response = await fetch(`${apiUrl}/api/exercises/${lessonId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return response.json();
  }

  return (
    <div className="flex overflow-hidden rounded-xl border border-ink-indigo/10">
      <StepRail
        activeStep={activeStep}
        completedSteps={completedSteps}
        onSelectStep={setActiveStep}
      />

      <div className="flex-1 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-caption text-ink-indigo/50">
              {t("stepLabel", { current: stepIndex, total: LESSON_STEP_ORDER.length })}
            </p>
            <h1 className="text-h3">{tLesson("title")}</h1>
          </div>

          <div className="flex gap-1.5 text-caption">
            {(["en", "ar"] as const).map((code) => (
              <button
                key={code}
                onClick={() => switchLocale(code)}
                aria-pressed={locale === code}
                className={`rounded-full px-2.5 py-1 font-medium ${
                  locale === code
                    ? "bg-signal-blue/10 text-signal-blue"
                    : "border border-ink-indigo/10 text-ink-indigo/50"
                }`}
              >
                {t(`languageSwitcher.${code}`)}
              </button>
            ))}
          </div>
        </div>

        {activeStep === "codingExercise" && (
          <>
            <p
              className="mb-4 text-body text-ink-indigo/70"
              // prompt contains an intentional inline <code> tag for the list
              // name, which must stay in Plex Mono even mid-Arabic-sentence.
              dangerouslySetInnerHTML={{ __html: tLesson.raw("prompt") }}
            />
            <CodeExercisePane starterCode={starterCode} onRun={handleRun} />
          </>
        )}
      </div>

      <CodeSpine snippets={spineSnippets} />
    </div>
  );
}
