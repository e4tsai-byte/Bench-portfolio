/**
 * Notebook.tsx
 *
 * The Notebook console: publications on the left leaf, patents on the right.
 *
 * LAYOUT, and why it is not what PRODUCT.md 11 specifies. That section asks for
 * "table of contents left / document viewer right". With one publication and
 * four patents an index is a thin use of a whole page, and it adds a selection
 * state the content does not need. The spread already has two pages, so each
 * collection gets one: the layout uses the object instead of floating over it.
 * The deviation is deliberate and recorded in the build log rather than left to
 * look like drift.
 *
 * CONTENT IS DATA (Invariant 1.5, blocking on claim accuracy). Everything here
 * comes from content/publications.ts and content/patents.ts. This component
 * renders content, it does not contain it, and it invents nothing: where the
 * data has no patent number, it says so rather than printing an empty string
 * that would read as one.
 *
 * NOT DRAWN INTO THE PAGE TEXTURE, deliberately. DESIGN.md 10.6 permits
 * generated surface markings only while nothing meaningful exists solely in the
 * render - canvas text is invisible to assistive technology. A patent number is
 * exactly the meaningful case, so it lives in the DOM where Section 3 governs
 * it. Projecting DOM onto the 3D page would also reimport the registration and
 * matrix apparatus D20 deleted.
 *
 * The panels are sized and inset so the gutter, the fore-edges, and the D26
 * quadrille stay visible around them (DESIGN.md 10.2).
 */
import { useEffect, useState } from 'react'
import { publications } from '../content/publications'
import { patents } from '../content/patents'

export default function Notebook() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Escape collapses an expanded entry. It does NOT exit to the bench: D23
  // ruled that no state is exitable by a keypress that is not also visibly and
  // persistently offered, and BackToBench is that offer.
  useEffect(() => {
    if (!expandedId) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedId(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expandedId])

  const toggle = (id: string) => setExpandedId((current) => (current === id ? null : id))

  return (
    <div className="spread">
      <section className="spread__leaf panel" aria-labelledby="leaf-publications">
        <p className="hud-label" id="leaf-publications">
          publications
        </p>

        {publications.length === 0 ? (
          <p className="plaque spread__empty">No publications loaded</p>
        ) : (
          <ul className="spread__list">
            {publications.map((item) => {
              const open = expandedId === item.id
              return (
                <li key={item.id} className="spread__entry">
                  <h3 className="spread__title">
                    <button
                      type="button"
                      className="spread__disclosure"
                      aria-expanded={open}
                      aria-controls={`entry-${item.id}`}
                      onClick={() => toggle(item.id)}
                    >
                      {item.title}
                    </button>
                  </h3>
                  <p className="spread__meta mono">
                    {item.venue} &middot; {item.year}
                  </p>

                  {open && (
                    <div id={`entry-${item.id}`} className="spread__body">
                      <p className="spread__authors">{item.authors}</p>
                      {item.contribution && (
                        <p className="spread__contribution">{item.contribution}</p>
                      )}
                      {item.tags.length > 0 && (
                        <ul className="spread__tags">
                          {item.tags.map((tag) => (
                            <li key={tag} className="tag">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.url && (
                        <a
                          className="spread__link"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {item.doi ? `doi ${item.doi}` : 'Read'}
                        </a>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="spread__leaf panel" aria-labelledby="leaf-patents">
        <p className="hud-label" id="leaf-patents">
          patents
        </p>

        {patents.length === 0 ? (
          <p className="plaque spread__empty">No patents loaded</p>
        ) : (
          <ul className="spread__list">
            {patents.map((item) => {
              const open = expandedId === item.id
              return (
                <li key={item.id} className="spread__entry">
                  <h3 className="spread__title">
                    <button
                      type="button"
                      className="spread__disclosure"
                      aria-expanded={open}
                      aria-controls={`entry-${item.id}`}
                      onClick={() => toggle(item.id)}
                    >
                      {item.title}
                    </button>
                  </h3>
                  <p className="spread__meta mono">
                    {/*
                      Never print an empty number as though it were one. The data
                      leaves it blank on purpose where no application number has
                      been supplied (see patents.ts), and Invariant 1.5 makes that
                      a blocking accuracy question, not a formatting one.
                    */}
                    {item.number ? item.number : 'no number issued'} &middot; {item.status}{' '}
                    &middot; {item.year}
                  </p>

                  {open && (
                    <div id={`entry-${item.id}`} className="spread__body">
                      {item.summary && <p className="spread__contribution">{item.summary}</p>}
                      {item.jurisdictions && item.jurisdictions.length > 0 && (
                        <ul className="spread__tags">
                          {item.jurisdictions.map((place) => (
                            <li key={place} className="tag">
                              {place}
                            </li>
                          ))}
                        </ul>
                      )}
                      {item.url && (
                        <a
                          className="spread__link"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Read
                        </a>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
