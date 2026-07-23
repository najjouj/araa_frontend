"use client";

import { useTranslations } from "next-intl";

export type LessonStepKey =
  | "motivation"
  | "explanation"
  | "illustration"
  | "video"
  | "interactiveExamples"
  | "guidedPractice"
  | "codingExercise"
  | "quiz"
  | "challenge"
  | "miniProject"
  | "summary"
  | "cheatSheet"
  | "commonMistakes"
  | "bestPractices";

// Fixed order per the lesson anatomy defined in the PRD (Section 4) —
// this array is the single source of truth for step sequencing.
export const LESSON_STEP_ORDER: LessonStepKey[] = [
  "motivation",
  "explanation",
  "illustration",
  "video",
  "interactiveExamples",
  "guidedPractice",
  "codingExercise",
  "quiz",
  "challenge",
  "miniProject",
  "summary",
  "cheatSheet",
  "commonMistakes",
  "bestPractices",
];

interface StepRailProps {
  activeStep: LessonStepKey;
  completedSteps: LessonStepKey[];
  onSelectStep: (step: LessonStepKey) => void;
}

export function StepRail({ activeStep, completedSteps, onSelectStep }: StepRailProps) {
  const t = useTranslations("lessonView.steps");

  return (
    <nav
      aria-label="Lesson steps"
      // w-[180px] fixed width mirrors automatically via flex order + dir=rtl
      // on the parent; no left/right positioning is hardcoded here.
      className="flex w-[180px] shrink-0 flex-col gap-0.5 bg-ink-indigo p-4"
    >
      {LESSON_STEP_ORDER.map((step) => {
        const isActive = step === activeStep;
        const isDone = completedSteps.includes(step);
        return (
          <button
            key={step}
            onClick={() => onSelectStep(step)}
            aria-current={isActive ? "step" : undefined}
            className={`rounded-md px-2.5 py-1.5 text-start text-caption transition-colors ${
              isActive
                ? "bg-signal-blue font-medium text-white"
                : isDone
                ? "text-white/70"
                : "text-white/40"
            }`}
          >
            {t(step)}
          </button>
        );
      })}
    </nav>
  );
}
