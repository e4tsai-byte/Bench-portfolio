/**
 * App.tsx
 *
 * Mounts the state machine (CLAUDE.md Section 2). It holds no content and no
 * art: it decides which scene is on screen and guarantees the way out.
 *
 * The per-state bodies below are Stage C placeholders. Stage D replaces them
 * with scenes/Bench.tsx and scenes/Microscope.tsx. What is NOT a placeholder
 * is the machine, the hash sync, and the Back-to-Bench guarantee.
 */
import { useEffect, useRef } from 'react'
import BackToBench from './components/BackToBench'
import {
  BENCH_OBJECTS,
  OBJECT_LABEL,
  isWiredThisPhase,
  useBenchMachine,
  type BenchObject,
} from './state/benchMachine'

export default function App() {
  const { state, enter, backToBench } = useBenchMachine()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  // With no router, nothing announces a navigation, so a screen reader or
  // keyboard user would be left where they were while the page changed under
  // them. Move focus to the new scene's heading on transition, but not on
  // first paint, which would steal focus from a fresh page load.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [state])

  const isBench = state === 'BENCH'

  return (
    <main className="scene">
      {/* Invariant 1.4: present in every non-BENCH state, without exception. */}
      {!isBench && <BackToBench onClick={backToBench} />}

      <h1 className="scene__heading" ref={headingRef} tabIndex={-1}>
        {isBench ? 'The bench' : OBJECT_LABEL[state]}
      </h1>

      {isBench ? (
        <BenchPlaceholder onEnter={enter} />
      ) : (
        <ObjectPlaceholder object={state} />
      )}

      <p className="hud-label">Stage C / state machine spine / no art yet</p>
    </main>
  )
}

/**
 * Stands in for scenes/Bench.tsx. The hotspots are plain buttons here because
 * there is no master still to position them over yet; Stage D turns them into
 * positioned Hotspot components over the render.
 *
 * Phase discipline (Invariant 1.7) is already enforced: an object that is not
 * wired this phase does not navigate. It shows the plaque instead.
 */
function BenchPlaceholder({ onEnter }: { onEnter: (object: BenchObject) => void }) {
  return (
    <ul className="bench-objects">
      {BENCH_OBJECTS.map((object) => {
        const wired = isWiredThisPhase(object)
        return (
          <li key={object}>
            {wired ? (
              <button type="button" className="card" onClick={() => onEnter(object)}>
                <h2>{OBJECT_LABEL[object]}</h2>
                <p style={{ color: 'var(--ink-1)' }}>Wired this phase. Enter.</p>
              </button>
            ) : (
              <div className="card card--opaque">
                <h2>{OBJECT_LABEL[object]}</h2>
                <p className="plaque">Coming soon</p>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function ObjectPlaceholder({ object }: { object: BenchObject }) {
  return (
    <section className="console">
      <p className="hud-label">{`state / ${object.toLowerCase()}`}</p>
      {isWiredThisPhase(object) ? (
        <p>
          This state is wired this phase. Stage D builds the console that belongs
          here.
        </p>
      ) : (
        <>
          <p className="plaque">Not built yet</p>
          <p style={{ color: 'var(--ink-1)', marginTop: 'var(--sp-4)' }}>
            Reachable and exitable so no state is dead (Invariant 1.4), but not
            wired to a view until its phase (Invariant 1.7).
          </p>
        </>
      )}
    </section>
  )
}
