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
import { useEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import type { BenchState } from '../state/benchMachine'
import { readDurations } from './palette'
import type { Object3D } from 'three'
import { EASE, MICROSCOPE_DIVE, NOTEBOOK_OPEN } from './motion'

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
  // Pulled back and raised from [0, 2.6, 7.2] / [0, 0.5, 0] when the flat slab
  // became a real bench. The slab had no vertical extent; bench.glb runs from
  // the floor at -3.6 to the reagent shelf at +2.75, about 6.4 units, which
  // overflowed a frame that only ever had to hold a tabletop. This framing
  // fits the whole bench and leaves calm space above it for the title.
  BENCH: { position: [0, 4.3, 11.6], target: [0, 0.15, 0] },
  MICROSCOPE: { position: [0.5, 1.55, 1.75], target: [0.2, 1.15, -0.2] },
  // Re-derived by D28, and it was a live defect before that. The old target
  // was [-2.0, 0.35, 0.35] while the notebook normalises to 0.076 units tall,
  // so the camera aimed 0.274 units ABOVE the book's top face - #notebook
  // framed mostly empty worktop. Same bug class as D24: a target carried over
  // from primitive-era assumptions.
  //
  // Aimed at the OPEN pose, not the closed one, because that is the state the
  // user actually sits in; the closed book only has to be in frame at the
  // start of the move. Opened, the spread runs from the transform toward +x
  // (see OBJECT_FACING), so the aim point shifts with it.
  // Framed on the OPEN spread's measured centre, not the closed book's. With
  // OBJECT_FACING turned 180 degrees the spread opens toward +x, putting its
  // centre 0.466 world units right of the transform: x -1.534. The spread is
  // 1.798 wide, so this sits back far enough to hold it with margin.
  // Elevation 50 degrees, azimuth -12, distance 2.9, aimed at the OPEN
  // spread's measured centre (-1.534, 0.019, 0.350). Verified to hold the
  // whole spread with no overflow at 16:9, 16:10 and 4:3, with the closed book
  // sitting left of centre so the spread grows rightward into reserved space -
  // which is why no follow-pan is needed and one camera tween suffices.
  //
  // The y of 2.24 is far above the other object states (1.2-1.55) and that is
  // deliberate: they stand up, a flat book has to be read from above.
  NOTEBOOK: { position: [-1.922, 2.241, 2.173], target: [-1.534, 0.019, 0.35] },
  CALENDAR: { position: [2.5, 1.2, 2.2], target: [2.4, 0.55, -0.2] },
  COMPUTER: { position: [-2.95, 1.5, 2.2], target: [-3.05, 0.6, -0.4] },
}

/**
 * Pose the notebook's three hinges.
 *
 * `setNotebookPose` is the pure-function half of D28's structural rule: the
 * rig's pose is a function of `state`, evaluated every commit, and the
 * timeline is only how it travels between poses. Nothing visible is ever
 * gated on an animation callback firing, which is the inverse of the failure
 * mode D25 debugged - there, the console stayed hidden until a callback ran,
 * so any path that reached the animated branch without completing it
 * stranded the user. Here a bug shows the book open early, never never.
 */
function hinges(root: Object3D | null | undefined) {
  if (!root) return null
  const cover = root.getObjectByName(NOTEBOOK_OPEN.nodes.cover)
  const pages = root.getObjectByName(NOTEBOOK_OPEN.nodes.pages)
  const spine = root.getObjectByName(NOTEBOOK_OPEN.nodes.spine)
  return cover && pages && spine ? { cover, pages, spine } : null
}

export function setNotebookPose(root: Object3D | null | undefined, open: boolean) {
  const h = hinges(root)
  if (!h) return
  const to = open ? NOTEBOOK_OPEN.open : NOTEBOOK_OPEN.closed
  // About Z, not Y: Blender authors these about Y and the glTF export maps
  // Blender +Y to glTF -Z. Driving Y here shears the book instead of opening it.
  h.cover.rotation.z = to.cover
  h.pages.rotation.z = to.pages
  h.spine.rotation.z = to.spine
}

export default function CameraRig({
  state,
  onDiveReveal,
  isUserInitiated,
  notebookRig,
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
  /**
   * The notebook's loaded rig, if its model is present (D28). Driven from
   * THIS component so the hinges and the camera share one timeline: two
   * effects keyed on `state` fall out of phase on a fast
   * BENCH -> NOTEBOOK -> BENCH, and the visible symptom is a book that opens
   * after the camera has already left.
   */
  notebookRig?: RefObject<Object3D | null>
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

    // The rig's pose is a pure function of state, set on EVERY commit before
    // any timeline is considered (D28). A direct #notebook link, first paint,
    // and reduced motion therefore all land on an already-open book with no
    // flip, which is the notebook's equivalent of D25's rule that none of
    // those paths ever sees the whiteout.
    const rig = notebookRig?.current
    const wantsOpen = state === 'NOTEBOOK'

    if (prefersReduced || wasFirst) {
      camera.position.set(...next.position)
      target.current = { x: next.target[0], y: next.target[1], z: next.target[2] }
      setNotebookPose(rig, wantsOpen)
      return
    }

    const { move, settle, fast } = readDurations()

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

    const h = hinges(rig)

    // NOTEBOOK arrival (D28): the camera flies in and HOLDS, then the book
    // opens while it watches from outside. It deliberately does not echo the
    // eyepiece dive - an ocular is a thing you put your eye to, so diving in
    // is what looking down one actually does, whereas a book opening is an
    // event you watch performed on an object. Diving here would also destroy
    // the ms_page quadrille (D26) at the exact moment it finally becomes
    // visible for the first time.
    if (h) {
      const timeline = gsap.timeline()
      timeline
        .to(camera.position, { ...xyz(next.position), duration: move, ease: EASE.move }, 0)
        .to(target.current, { ...xyz(next.target), duration: move, ease: EASE.move }, 0)

      const pose = wantsOpen ? NOTEBOOK_OPEN.open : NOTEBOOK_OPEN.closed
      // Every number here is a token. The covers and spine ride `move` while
      // the pages ride the longer `settle`, all starting together, which makes
      // the pages trail BY CONSTRUCTION rather than by a hand-tuned offset -
      // satisfying NOTEBOOK_OPEN's ordering rule with no magic fractions
      // (Invariant 1.6, D13). The flip begins one `fast` before the camera
      // settles so the arrival does not stall, again from a token.
      const start = wantsOpen ? move - fast : 0
      const boards = wantsOpen ? move : move
      const leaves = wantsOpen ? settle : move
      timeline
        .to(h.cover.rotation, { z: pose.cover, duration: boards, ease: EASE.move }, start)
        .to(h.spine.rotation, { z: pose.spine, duration: boards, ease: EASE.move }, start)
        .to(h.pages.rotation, { z: pose.pages, duration: leaves, ease: EASE.move }, start)
      return () => timeline.kill()
    }

    const tweens = [
      gsap.to(camera.position, { ...xyz(next.position), duration: move, ease: EASE.move }),
      gsap.to(target.current, { ...xyz(next.target), duration: move, ease: EASE.move }),
    ]
    return () => tweens.forEach((t) => t.kill())
  }, [state, camera, isUserInitiated, notebookRig])

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
