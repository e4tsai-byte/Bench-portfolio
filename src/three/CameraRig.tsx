/**
 * CameraRig.tsx
 *
 * One camera state per bench state (CLAUDE.md Invariant 1.2, as amended by
 * D20). This replaces the crossfade-plus-scale fake: the transition is now an
 * actual camera move, so nothing has to be registered, scaled, or matched
 * between two exports.
 *
 * Motion obeys Invariant 1.8: fast-in slow-out, no overshoot, durations read
 * from tokens, and `prefers-reduced-motion` cuts straight to the destination
 * with no travel at all.
 *
 * Since D25, entering MICROSCOPE by an animated bench transition is a
 * three-leg timeline (the eyepiece dive), not the plain single tween every
 * other state uses. See three/motion.ts for the dive's keyframes and the
 * reasoning behind them.
 */
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import type { BenchState } from '../state/benchMachine'
import { readDurations } from './palette'
import { EASE, MICROSCOPE_DIVE } from './motion'

interface CameraState {
  /** Where the camera sits. */
  position: [number, number, number]
  /** What it looks at. */
  target: [number, number, number]
}

const xyz = ([x, y, z]: [number, number, number]) => ({ x, y, z })

/**
 * The bench view sits back and high enough to see all four objects separated.
 * Each object state flies to a close three-quarter framing of that object.
 * MICROSCOPE's entry here is also the RESTING destination used by reduced
 * motion, first paint, and a direct #microscope link (D25): none of those
 * play the eyepiece dive, all three land here directly. See D24 for why
 * this specific framing was chosen (the quiet-zone legibility measurement
 * behind the microscope console).
 */
export const CAMERA_STATES: Record<BenchState, CameraState> = {
  BENCH: { position: [0, 2.6, 7.2], target: [0, 0.5, 0] },
  MICROSCOPE: { position: [0.5, 1.55, 1.75], target: [0.2, 1.15, -0.2] },
  NOTEBOOK: { position: [-1.9, 1.25, 2.1], target: [-2.0, 0.35, 0.35] },
  CALENDAR: { position: [2.5, 1.2, 2.2], target: [2.4, 0.55, -0.2] },
  COMPUTER: { position: [-2.95, 1.5, 2.2], target: [-3.05, 0.6, -0.4] },
}

export default function CameraRig({
  state,
  onDiveReveal,
  isUserInitiated,
}: {
  state: BenchState
  /**
   * Fired partway through the eyepiece dive (the start of its final leg), so
   * the DOM-side console and whiteout overlay can cross-dissolve in step
   * with the camera's last push rather than snapping in after it completes
   * (DESIGN.md 4.3's "no visible snap at the finish" applies here too, just
   * to a different property). Held in a ref internally so passing a fresh
   * inline function every render does not restart the timeline.
   */
  onDiveReveal?: () => void
  /**
   * Whether the CURRENT state was reached by an actual click, not by
   * anything else. Gates the eyepiece dive specifically (see where it is
   * read below); it does not touch `wasFirst`, which still governs the
   * ordinary instant-vs-tween choice for every state exactly as it always
   * has.
   *
   * This exists because `wasFirst` alone is not precise enough for the dive.
   * `useBenchMachine` derives its initial state from `location.hash` in a
   * lazy `useState` initializer, which runs synchronously on the first
   * render, but in some environments `location.hash` is not yet readable at
   * that exact synchronous point for a fresh navigation to a URL that
   * already carries a hash. The hook's own mount effect corrects this a tick
   * later once the hash IS readable, which means a direct #microscope link
   * can genuinely commit `state: 'BENCH'` first and `state: 'MICROSCOPE'`
   * moments after, a real second commit that `wasFirst` cannot tell apart
   * from an actual user transition. Before D25 that distinction did not
   * matter, because either path was just an instant camera snap. After D25
   * it does: that second, hash-correcting commit would otherwise satisfy
   * `!prefersReduced && !wasFirst` and run the full eyepiece dive on what a
   * user experiences as a direct link. Only App.tsx's handleEnter, called
   * from an actual click, ever sets the flag this prop carries, which makes
   * it immune to however many automatic corrections the hash sync makes on
   * the way to a stable value.
   */
  isUserInitiated?: boolean
}) {
  const camera = useThree((s) => s.camera)
  // The look-at target is animated too, not just the position. Animating only
  // position and re-pointing at the end produces a visible snap at the finish.
  const target = useRef({ x: 0, y: 0.5, z: 0 })
  const onDiveRevealRef = useRef(onDiveReveal)
  onDiveRevealRef.current = onDiveReveal

  /**
   * `isMounted` tracks "has this component ever truly mounted," set by a
   * DEDICATED empty-deps effect declared AFTER the state-keyed effect below
   * that reads it. The declaration order is load-bearing, not incidental:
   * React runs effects for one commit in declaration order, so on the very
   * first commit the state-effect reads `isMounted.current` while it is
   * still false (this mount-tracker has not run yet THIS pass), and only
   * after that does the mount-tracker flip it to true for whatever runs
   * next. Swap the order and the mount-tracker would flip it before the
   * state-effect ever saw it false, even on the true first pass.
   *
   * This shape is what survives React 18 StrictMode's development-only
   * double-invoke of an initial mount's effects (mount, run, cleanup, run
   * again), and it is worth recording why two effects are needed rather
   * than one, because two simpler-looking alternatives were tried here
   * first and both failed:
   *
   *   - A ref mutated in the state-effect's own body, with no inverse in
   *     cleanup: the synthetic second invocation sees the ref already
   *     flipped and wrongly takes the animated path (for MICROSCOPE, that
   *     means running the real eyepiece dive on a direct link).
   *   - The same ref restored inside the state-effect's own cleanup:
   *     cleanup ALSO runs on every real subsequent transition (React cleans
   *     up the previous effect instance before running the next one
   *     whenever [state] actually changes), so restoring there wrongly
   *     marks every later real transition as "first" too.
   *
   * A separate mount-tracker effect with empty deps sidesteps both: its own
   * cleanup only ever runs on a genuine unmount (empty deps means [state]
   * changing cannot trigger it), so `isMounted.current` stays true for the
   * component's whole real lifetime once set, while still correctly ending
   * up false again between StrictMode's two synthetic invocations, since
   * its cleanup runs between them same as any other effect's would.
   */
  const isMounted = useRef(false)

  useEffect(() => {
    const next = CAMERA_STATES[state]
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Invariant 1.8: reduced motion cuts to the destination, and so does the
    // very first paint, which is an arrival rather than a transition. Per
    // D25, this is also what skips the eyepiece dive entirely: landing a
    // reduced-motion user, or a direct #microscope link, cold on a full
    // whiteout with no context for where they are would be more disorienting
    // than the standard treatment, not less.
    const wasFirst = !isMounted.current

    if (prefersReduced || wasFirst) {
      camera.position.set(...next.position)
      target.current = { x: next.target[0], y: next.target[1], z: next.target[2] }
      return
    }

    const { move, settle } = readDurations()

    if (state === 'MICROSCOPE' && isUserInitiated) {
      // The eyepiece dive (D25). Gated on isUserInitiated, not just on this
      // being an animated (non-instant) transition: see that prop's own
      // comment for why. A non-user-initiated arrival at MICROSCOPE (which
      // in practice should not reach this branch anyway, since it would
      // also be wasFirst) falls through to the plain single tween below,
      // the same one every other state uses.
      //
      // Not a single tween: leg 1 reuses the
      // existing bench-to-head move verbatim, so the hard-won three-quarter
      // framing (D24) still lands as a real beat rather than being skipped.
      // Leg 2 re-aligns onto the ocular's own axis (Eyepoint_L, aimed at
      // Eye_Lens_L) before committing, because a straight chord from the
      // ORIGINAL external position to a point deep inside the eyecup is not
      // generically coaxial with the tube and risks visibly clipping through
      // the eyecup rim or prism housing mid-flight. Leg 3 is the short,
      // committed push through the disc that produces the whiteout.
      const head = CAMERA_STATES.MICROSCOPE
      const timeline = gsap.timeline()
      timeline
        .to(camera.position, { ...xyz(head.position), duration: move, ease: EASE.move })
        .to(target.current, { ...xyz(head.target), duration: move, ease: EASE.move }, '<')
        .to(camera.position, {
          ...xyz(MICROSCOPE_DIVE.eyepoint.position),
          duration: move,
          ease: EASE.move,
        })
        .to(
          target.current,
          { ...xyz(MICROSCOPE_DIVE.eyepoint.target), duration: move, ease: EASE.move },
          '<',
        )
        .addLabel('dive')
        .call(() => onDiveRevealRef.current?.())
        .to(camera.position, {
          ...xyz(MICROSCOPE_DIVE.end.position),
          duration: settle,
          ease: EASE.move,
        })
        .to(
          target.current,
          { ...xyz(MICROSCOPE_DIVE.end.target), duration: settle, ease: EASE.move },
          '<',
        )
      return () => timeline.kill()
    }

    const tweens = [
      gsap.to(camera.position, { ...xyz(next.position), duration: move, ease: EASE.move }),
      gsap.to(target.current, { ...xyz(next.target), duration: move, ease: EASE.move }),
    ]
    return () => tweens.forEach((t) => t.kill())
  }, [state, camera, isUserInitiated])

  // Declared AFTER the state-effect above: see isMounted's own comment for
  // why the order is load-bearing, not stylistic.
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useFrame(() => {
    camera.lookAt(target.current.x, target.current.y, target.current.z)
  })

  return null
}
