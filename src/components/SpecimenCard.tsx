/**
 * SpecimenCard.tsx
 *
 * A single research item as a floating glass specimen (DESIGN.md 4.5).
 *
 * Collapsed face carries exactly what ResearchItem's own field comments
 * specify: `summary` is annotated "for the specimen card face," `abstract`
 * is "long form." The face never shows the abstract. Uniform across every
 * item regardless of which optional fields (`links`, `figure`) it happens to
 * carry, so no specimen looks more "finished" than another.
 *
 * A real <button>, not a div with an onClick: DESIGN.md 3 item 3 requires
 * every interactive element be keyboard-reachable, and button.card is
 * already styled in console.css, so this satisfies it for free.
 *
 * Selection is a disclosure, not a modal (see Microscope.tsx): aria-expanded
 * and aria-controls make that relationship explicit to assistive tech, not
 * just visual.
 */
import type { ResearchItem } from '../content/research'

interface SpecimenCardProps {
  item: ResearchItem
  isExpanded: boolean
  isForward: boolean
  onToggle: () => void
}

export default function SpecimenCard({ item, isExpanded, isForward, onToggle }: SpecimenCardProps) {
  const panelId = `specimen-reading-${item.id}`

  return (
    <button
      type="button"
      className={`card specimen${isForward && !isExpanded ? ' specimen--forward' : ''}`}
      aria-expanded={isExpanded}
      aria-controls={panelId}
      onClick={onToggle}
    >
      <h3>{item.title}</h3>
      <div className="specimen__meta">
        <span>{item.role}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{item.org}</span>
      </div>
      <p className="specimen__period mono">{item.period}</p>
      <div className="specimen__tags">
        {item.field.map((f) => (
          <span key={f} className="tag">
            {f}
          </span>
        ))}
        {/* A content signal, not decoration: lets a scanning user know a
            citation exists before expanding (design review, section 2). */}
        {item.links && item.links.length > 0 && <span className="tag">Cited</span>}
      </div>
      <p className="specimen__summary">{item.summary}</p>
    </button>
  )
}
