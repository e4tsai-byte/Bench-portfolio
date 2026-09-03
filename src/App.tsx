/**
 * App.tsx
 *
 * Mounts the state machine (CLAUDE.md Section 2) and the one real-time scene
 * (Invariant 1.2, as amended by D20). It holds no content and no art: it
 * decides what is on screen and guarantees the way out.
 */
import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import BackToBench from './components/BackToBench'
import BenchScene from './three/BenchScene'
import Microscope from './scenes/Microscope'
import { CAMERA_STATES } from './three/CameraRig'
import { OBJECT_LABEL, isWiredThisPhase, useBenchMachine } from './state/benchMachine'

export default function App() {
  const { state, enter, backToBench } = useBenchMachine()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  // With no router, nothing announces a navigation, so a screen reader or
  // keyboard user would be left where they were while the scene changed under
  // them. Move focus to the new heading, but not on first paint.
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
      <div className="scene__canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ fov: 35, position: CAMERA_STATES.BENCH.position }}
          // The page ground shows through; the scene does not paint its own
          // background, so there is one ground colour, from tokens (1.1, 1.6).
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <BenchScene state={state} onSelect={enter} />
          </Suspense>
        </Canvas>
      </div>

      <div className="scene__ui">
        {/* Invariant 1.4: present in every non-BENCH state, without exception. */}
        {!isBench && <BackToBench onClick={backToBench} />}

        <h1 className="scene__heading" ref={headingRef} tabIndex={-1}>
          {isBench ? 'The bench' : OBJECT_LABEL[state]}
        </h1>

        {isBench ? (
          <p className="hud-label">Stage D / real-time scene / placeholder geometry</p>
        ) : state === 'MICROSCOPE' ? (
          <Microscope />
        ) : isWiredThisPhase(state) ? (
          <p className="hud-label">{`state / ${state.toLowerCase()}`}</p>
        ) : (
          <p className="plaque">Coming soon</p>
        )}
      </div>

      {/*
        Keyboard route into every wired object. The canvas is pointer-driven, so
        without this the only way in would be a mouse, which would fail
        DESIGN.md Section 3 item 3. Visually quiet, fully focusable.
      */}
      {isBench && (
        <nav className="bench-keys" aria-label="Bench objects">
          <ul>
            {(['MICROSCOPE', 'NOTEBOOK', 'CALENDAR', 'COMPUTER'] as const).map((object) => (
              <li key={object}>
                <button
                  type="button"
                  className="bench-key"
                  onClick={() => enter(object)}
                  disabled={!isWiredThisPhase(object)}
                >
                  {OBJECT_LABEL[object]}
                  {!isWiredThisPhase(object) && <span className="plaque">Soon</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  )
}
