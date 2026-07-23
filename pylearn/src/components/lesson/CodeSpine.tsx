interface CodeSpineProps {
  /**
   * Real snippets pulled from the current track's lesson examples — per the
   * Phase 4 open item, this must never be arbitrary filler text. Callers
   * should pass 3-6 short lines sampled from lessons the student has access to.
   */
  snippets: string[];
}

/**
 * The platform's signature visual element (Phase 4, Section 2). A thin,
 * low-opacity ribbon of real Python code that runs down the margin of
 * long-form screens. It is the one element that never translates and never
 * mirrors under RTL — `dir="ltr"` is forced regardless of the document
 * direction, because Python syntax is always read left-to-right in both
 * locales. Purely atmospheric: no interaction, no click targets.
 */
export function CodeSpine({ snippets }: CodeSpineProps) {
  return (
    <div
      dir="ltr"
      aria-hidden="true"
      className="pointer-events-none hidden w-10 shrink-0 select-none flex-col gap-3 overflow-hidden py-6 font-mono text-caption text-spine-teal/20 lg:flex"
    >
      {snippets.map((line, i) => (
        <span key={i} className="whitespace-nowrap [writing-mode:vertical-rl]">
          {line}
        </span>
      ))}
    </div>
  );
}
