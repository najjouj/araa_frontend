# PyLearn frontend — Phase 5 scaffold

This is the Phase 5 deliverable: the design-token system, the i18n routing
scaffold, and one fully wired component slice (the lesson view's
coding-exercise step), built on the architecture from Phase 3 and the
visual identity from Phase 4.

## What's here

- `tailwind.config.ts` — the Phase 4 design tokens (colors, fonts, type scale)
  as the single source of truth. Components reference token names only.
- `src/i18n/request.ts`, `src/middleware.ts` — locale-aware routing
  (`/en/...`, `/ar/...`), with the locale registry as the one place to edit
  when a third language is added later.
- `messages/en.json`, `messages/ar.json` — translation-keyed content,
  matching the "structure vs. content" separation from Phase 2's
  information architecture.
- `src/app/[locale]/layout.tsx` — sets `dir="ltr"`/`dir="rtl"` on `<html>`
  based on locale, so the rest of the app mirrors automatically via CSS
  logical properties.
- `src/components/lesson/` — `StepRail`, `CodeSpine`, `CodeExercisePane`,
  and the composed `LessonView`. Notably, `CodeSpine` and the code editor
  inside `CodeExercisePane` force `dir="ltr"` explicitly and never
  translate — this is the one deliberate exception to the mirroring rule,
  because Python syntax is always read left-to-right (Phase 3 §3, Phase 4 §1).
- `src/app/[locale]/roadmap/[track]/[module]/[lesson]/page.tsx` — the route
  from the Phase 2 site map, wired to a hardcoded sample lesson (`lists-intro`)
  since real data-fetching depends on the FastAPI service built in a later phase.

## What's intentionally not here yet

- The other 13 lesson-step content types (only `codingExercise` is wired;
  the rest follow the same content-swap pattern in `LessonView`).
- Any actual API/backend code — `/api/exercises/{lessonId}/submit` is called
  as a fetch stub; the real endpoint is a Phase 5-backend or Phase 6 item.
- Auth, dashboards, teacher views — out of scope for this slice; same
  component patterns apply once this shell is approved.

## Running it

```bash
npm install
npm run dev
```

Then visit `/en/roadmap/beginner/lists/lists-intro` or
`/ar/roadmap/beginner/lists/lists-intro` to see the LTR/RTL mirroring in
practice — everything flips except the code editor and the code spine.
