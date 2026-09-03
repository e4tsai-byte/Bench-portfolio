/**
 * motion.ts
 *
 * The second consumer D13 anticipated (CLAUDE.md Section 7): GSAP ease
 * strings are not valid CSS, so they were kept as one exported constant in
 * `CameraRig.tsx` "until a second consumer exists... at which point they
 * earn a dedicated motion module." The eyepiece-dive DOM fade (App.tsx,
 * cross-dissolving with the camera's final push) is that second consumer,
 * so `EASE` moves here rather than staying CameraRig-only.
 *
 * The dive keyframes also live here rather than inline in CameraRig.tsx,
 * because they are DATA about the model (specific node positions in the
 * live scene), not logic, and keeping them named and commented in one place
 * means a re-export of the model only costs updating these numbers, not
 * re-deriving the reasoning.
 */

/** Mirrors DESIGN.md 2.7's motion tokens; see CameraRig.tsx for why these
 * live as strings here rather than in tokens.css (GSAP ease names are not
 * valid CSS). */
export const EASE = {
  move: 'power3.out',
  fast: 'power2.out',
} as const

/**
 * The eyepiece-dive terminal keyframes (D25). Committed to the LEFT ocular
 * only (`Eyepoint_L` / `Eye_Lens_L`); the model's own geometry rules out a
 * centred push (the two bores diverge from the prism housing with no shared
 * point a camera can look squarely down), and the choice between L and R is
 * otherwise arbitrary, so L was picked for the shorter lateral travel from
 * the existing MICROSCOPE resting camera state.
 *
 * Values are the live scene's actual world-space positions (measured via a
 * temporary probe against the running app, not derived from the .glb's raw
 * node transforms, which are in pre-normalisation model space and would be
 * wrong by roughly the model's own scale factor if used directly). If the
 * model is re-exported and the eyepiece geometry moves, re-measure rather
 * than guess: mount a temporary probe on Model.tsx's group ref, call
 * `getObjectByName` for `Eyepoint_L` / `Eye_Lens_L`, and read
 * `getWorldPosition()`.
 *
 * The disc (`Eye_Lens_L`, the `ms_eye_glow` material) has a measured
 * world-space bounding radius of ~0.117 units. At FOV 35 degrees, a surface
 * fills the frame once camera distance is less than roughly 3.2x its
 * radius, i.e. within about 0.37 units. `DIVE_END` sits about 0.05 units
 * from the disc, comfortably inside that threshold with margin for a model
 * re-export to drift without reopening this number.
 */
export const MICROSCOPE_DIVE = {
  /** Leg 2 destination: raise the scope to eye level, aimed down the barrel. */
  eyepoint: {
    position: [0.34, 1.409, 0.221] as [number, number, number],
    target: [0.313, 1.27, 0.133] as [number, number, number],
  },
  /** Leg 3 destination: the committed push past the disc. This is the frame
   * DESIGN.md 10.5 governs and tools/composite-audit.js's terminal-frame
   * assertion checks. */
  end: {
    position: [0.321, 1.312, 0.159] as [number, number, number],
    target: [0.305, 1.228, 0.106] as [number, number, number],
  },
} as const
