import { LessonView } from "@/components/lesson/LessonView";

// Representative implementation for the Phase 2 route
// /{locale}/roadmap/{track}/{module}/{lesson-slug}. In production this
// fetches lesson + translation rows (Phase 2 schema, Section 3.2-3.4) by
// slug; hardcoded here since Phase 5 scope is the component shell, not
// data-fetching, which depends on the FastAPI service from a later phase.
export default function LessonPage({
  params,
}: {
  params: { track: string; module: string; lesson: string };
}) {
  return (
    <main className="mx-auto max-w-7xl p-6">
      <LessonView
        lessonId="lists-intro"
        starterCode={'groceries = ["bread"]\n# write your code below\n\nprint(len(groceries))'}
      />
    </main>
  );
}
