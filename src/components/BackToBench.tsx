/**
 * BackToBench.tsx
 *
 * The persistent escape control (CLAUDE.md Invariant 1.4, DESIGN.md 4.7).
 * Visible in every non-BENCH state, corner-anchored, always the same position,
 * so a user never has to look for the way out.
 *
 * It is secondary chrome, so it sits at --ink-1 and at the periphery and does
 * not compete with the focused object (DESIGN.md 5, the one-focus rule).
 */

interface BackToBenchProps {
  onClick: () => void
}

export default function BackToBench({ onClick }: BackToBenchProps) {
  return (
    <button type="button" className="back-to-bench" onClick={onClick}>
      {/* An SVG mark built from tokens, never an emoji (DESIGN.md 7). */}
      <svg
        className="back-to-bench__mark"
        viewBox="0 0 16 16"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M10 3 L5 8 L10 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back to bench
    </button>
  )
}
