/**
 * App.tsx
 *
 * Mounts the state machine (CLAUDE.md Section 2) and the one real-time scene
 * (Invariant 1.2, as amended by D20). It holds no content and no art: it
 * decides what is on screen and guarantees the way out.
 */
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import BackToBench from './components/BackToBench'
import BenchScene from './three/BenchScene'
import Microscope from './scenes/Microscope'
import Notebook from './scenes/Notebook'
import { CAMERA_STATES } from './three/CameraRig'
import {
  OBJECT_LABEL,
  isWiredThisPhase,
  useBenchMachine,
  type BenchObject,
} from './state/benchMachine'

/**
 * D25: the eyepiece dive's arrival phase, driving the console and whiteout
 * cross-dissolve (see console.css's .whiteout / .console-arrival).
 *
 * Four states, not three, because "arrived with no whiteout" (reduced
 * motion, first paint, a direct #microscope link) and "arrived via the dive,
 * whiteout showing" both end at "the console is visible" but must NOT share
 * a name, or the CSS driving each layer cannot tell them apart:
 *
 *   - 'idle': not in MICROSCOPE.
 *   - 'instant': landed directly on the resting three-quarter framing
 *     (Invariant 1.8), console visible immediately, no whiteout ever for
 *     this visit, matching how every other state already behaves.
 *   - 'diving': an animated bench-to-microscope transition is in its first
 *     two legs (the visible flight toward and into the eyepiece). Console
 *     stays hidden, whiteout stays hidden: this is the travel the request
 *     asks to see, not something to cover early.
 *   - 'revealed': the dive's final leg has begun (CameraRig's onDiveReveal
 *     callback). Whiteout and console cross-dissolve in together and the
 *     whiteout stays up for as long as the visit lasts, a guaranteed floor
 *     under the render rather than a momentary flash (brand-designer, D25).
 */
type ArrivalPhase = 'idle' | 'instant' | 'diving' | 'revealed'

export default function App() {
  const { state, enter, backToBench } = useBenchMachine()
  const headingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)
  const [arrivalPhase, setArrivalPhase] = useState<ArrivalPhase>('idle')

  /**
   * Whether MICROSCOPE was reached by an actual click, not by anything else.
   *
   * This turned out to be necessary for a reason worth recording: "was this
   * the component's first commit" (isFirstRender, below) is NOT the same
   * question as "was this an animated transition a user should see," and
   * D25 is where that stopped being a harmless difference. `useBenchMachine`
   * derives its initial state from `location.hash` in a `useState` lazy
   * initializer, which runs synchronously during the first render, but in
   * this environment `location.hash` is not always readable at that exact
   * synchronous point for a fresh navigation to a URL that already has a
   * hash. The hook's own mount effect corrects this a tick later once the
   * hash IS readable, which means a direct `#microscope` link can genuinely
   * render `state: 'BENCH'` first and then `state: 'MICROSCOPE'` moments
   * later, a real (second) commit indistinguishable from a real transition
   * by isFirstRender alone. Before D25 this was invisible, because the only
   * consequence was an instant camera snap either way. After D25 it was not:
   * that second commit would satisfy `!prefersReduced && !isFirstRender`
   * and run the full eyepiece dive, whiteout and all, on what a user
   * experiences as a direct link. Only a genuine click, via handleEnter
   * below, may ever set this true, which is what makes it immune to however
   * many automatic corrections the hash-sync effect makes on the way to a
   * stable value.
   */
  const hasUserNavigated = useRef(false)
  const handleEnter = useCallback(
    (object: BenchObject) => {
      hasUserNavigated.current = true
      enter(object)
    },
    [enter],
  )

  // Classifies THIS entry into MICROSCOPE as a dive or an instant arrival.
  // The binding condition is hasUserNavigated (see its comment); isFirstRender
  // is kept alongside it as a second, redundant guard, both because it costs
  // nothing and because it is what CameraRig's OWN generic instant-vs-tween
  // logic still uses for every state, including MICROSCOPE's non-dive path.
  useEffect(() => {
    if (state !== 'MICROSCOPE') {
      setArrivalPhase('idle')
      return
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isDive = !prefersReduced && !isFirstRender.current && hasUserNavigated.current
    setArrivalPhase(isDive ? 'diving' : 'instant')
  }, [state])

  // With no router, nothing announces a navigation, so a screen reader or
  // keyboard user would be left where they were while the scene changed
  // under them. Move focus to the new heading, but not on first paint. Also
  // declared before the mount-tracker effect, for the same reason as above:
  // this only READS isFirstRender.current now, it does not mutate it.
  useEffect(() => {
    if (isFirstRender.current) return
    headingRef.current?.focus()
  }, [state])

  // The dedicated mount-tracker: the ONLY writer of isFirstRender.current,
  // and the reason it is safe for the two effects above to just read it.
  // Empty deps, declared LAST. See three/CameraRig.tsx's isMounted for the
  // full explanation; the short version is that a ref mutated inside a
  // [state]-keyed effect's own body, with no correct inverse in cleanup,
  // cannot survive React 18 StrictMode's development-only double-invoke of
  // an initial mount's effects without either wrongly treating the
  // synthetic second pass as a real transition, or (if naively restored in
  // that same effect's cleanup) wrongly treating every later REAL transition
  // as a first paint too, since cleanup also runs on those. Isolating the
  // mutation into its own empty-deps effect avoids both: its cleanup only
  // ever runs on a genuine unmount or StrictMode's synthetic replay, never
  // because [state] changed for a real reason.
  useEffect(() => {
    isFirstRender.current = false
    return () => {
      isFirstRender.current = true
    }
  }, [])

  const isBench = state === 'BENCH'

  return (
    <main className="scene">
      <div className="scene__canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{
            fov: 35,
            position: CAMERA_STATES.BENCH.position,
            // D25: the eyepiece dive ends with the camera roughly 0.05 world
            // units from the disc it is looking at (three/motion.ts). The
            // R3F default near plane (0.1) is larger than that distance, so
            // without lowering it the terminal geometry gets clipped away by
            // the camera itself at exactly the moment it is meant to fill
            // frame. Safe at this scene's small scale (tens of units, not
            // thousands), so it costs nothing on the wide BENCH view.
            near: 0.01,
          }}
          // The page ground shows through; the scene does not paint its own
          // background, so there is one ground colour, from tokens (1.1, 1.6).
          gl={{ alpha: true, antialias: true }}
        >
          <Suspense fallback={null}>
            <BenchScene
              state={state}
              onSelect={handleEnter}
              isUserInitiated={hasUserNavigated.current}
              onDiveReveal={() => setArrivalPhase('revealed')}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* D25: a real --ground-2 fill, not a CSS trick standing in for the
          render. Guarantees a literal pure-white handoff regardless of
          lighting variance across devices, and stays up for the whole visit
          rather than a momentary flash, so "I would not be able to see the
          bench at all" holds for as long as the user is here, not just at
          the instant of arrival. The emissive ms_eye_glow material
          (Model.tsx) does the rest of the work of selling "the light itself
          gets closer" during the dive's final push; this overlay is the
          floor under it, not a replacement for it. */}
      <div className={`whiteout${arrivalPhase === 'revealed' ? ' whiteout--visible' : ''}`} />

      <div className="scene__ui">
        {/* Invariant 1.4: present in every non-BENCH state, without exception. */}
        {!isBench && <BackToBench onClick={backToBench} />}

        <h1 className="scene__heading" ref={headingRef} tabIndex={-1}>
          {isBench ? 'The bench' : OBJECT_LABEL[state]}
        </h1>

        {isBench ? (
          <p className="hud-label">Stage D / real-time scene / placeholder geometry</p>
        ) : state === 'MICROSCOPE' ? (
          // 'diving' keeps the console hidden through the two travel legs, per
          // the request: the flight itself is meant to be seen, not covered.
          // 'instant' and 'revealed' both show it; only their PATH there
          // differs (immediately vs. cross-dissolving with the whiteout).
          <div
            className={`console-arrival${arrivalPhase === 'diving' ? ' console-arrival--diving' : ''}`}
          >
            <Microscope />
          </div>
        ) : state === 'NOTEBOOK' ? (
          <Notebook />
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
                  onClick={() => handleEnter(object)}
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
