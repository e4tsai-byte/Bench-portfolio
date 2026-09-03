/**
 * Microscope.tsx
 *
 * The Phase 1 console (CLAUDE.md Section 2): the circular viewfinder, the
 * floating specimen cards from research.ts, and static HUD crosshairs.
 *
 * Content is consumed directly from content/research.ts (Invariant 1.5: this
 * component renders content, it does not contain it). Selection is a single
 * inline disclosure, not a modal, per the ux-designer review that planned
 * this: a modal duplicates the "how do I get out" problem BackToBench
 * already solves once for the whole console, and Section 2.5's stacking rule
 * would force a modal card onto its own opaque panel, adding a visual layer
 * the design does not otherwise have.
 */
import { useEffect, useState } from 'react'
import ViewfinderMask from '../components/ViewfinderMask'
import HudCrosshairs from '../components/HudCrosshairs'
import SpecimenCard from '../components/SpecimenCard'
import { research } from '../content/research'

export default function Microscope() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Escape collapses an expanded card back to the arc; it does not exit to
  // the bench. BackToBench remains the only route out (design review,
  // section 4): no state here is exitable by a keypress that is not also
  // visibly, persistently offered.
  useEffect(() => {
    if (!expandedId) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expandedId])

  const forwardIndex = Math.floor(research.length / 2)
  const expandedItem = research.find((item) => item.id === expandedId) ?? null

  return (
    <>
      <ViewfinderMask>
        <HudCrosshairs />
      </ViewfinderMask>

      {research.length === 0 ? (
        // CLAUDE.md 1.5: degrade gracefully on an empty array. "Render
        // nothing" for the cards alone would leave a circle staring back
        // with no explanation, which reads as broken rather than empty.
        // Reuses the existing .plaque vocabulary (Invariant 1.7's
        // "coming soon" pattern) rather than inventing a new one.
        <p className="plaque" style={{ display: 'block', textAlign: 'center', marginTop: 'var(--sp-6)' }}>
          No specimens loaded
        </p>
      ) : (
        <>
          <div className="specimens">
            {research.map((item, index) => (
              <SpecimenCard
                key={item.id}
                item={item}
                isExpanded={expandedId === item.id}
                isForward={index === forwardIndex}
                onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
              />
            ))}
          </div>

          {expandedItem && (
            <div id={`specimen-reading-${expandedItem.id}`} className="specimen-reading console">
              <p className="hud-label">
                {expandedItem.role} &middot; {expandedItem.org}
              </p>
              <h2>{expandedItem.title}</h2>
              <p className="specimen__period mono">{expandedItem.period}</p>
              <p className="specimen-reading__abstract">{expandedItem.abstract}</p>

              {expandedItem.figure && (
                <img src={expandedItem.figure} alt="" className="specimen-reading__figure" />
              )}

              {expandedItem.links && expandedItem.links.length > 0 && (
                <div className="specimen-reading__links">
                  {expandedItem.links.map((link) => (
                    <a
                      key={link.url}
                      className="specimen-reading__link"
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="specimen-reading__close"
                onClick={() => setExpandedId(null)}
              >
                Close
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
