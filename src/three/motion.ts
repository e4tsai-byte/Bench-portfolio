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

/**
 * NOTEBOOK_OPEN - the notebook's opening flip (D28).
 *
 * AXIS. In Blender these hinges rotate about Y. The glTF export maps Blender
 * +Y to glTF -Z, so in three.js they must be driven about **Z**, not Y.
 * Driving Y here produces a book that shears instead of opening, and the
 * numbers below are the ones that survived being checked in the browser
 * rather than the ones the Blender file suggests. Re-measure by looking if
 * the model is ever re-exported; do not re-derive on paper.
 *
 * The three hinges do not move in lockstep. A real hardcover's spine flattens
 * as the board swings, at roughly half the angle, and the leaves trail the
 * cover slightly because paper is not rigid. Both are cheap to express as an
 * offset on one timeline and both are what stop the motion reading as a
 * hinged box lid.
 */
export const NOTEBOOK_OPEN = {
  /** Node names as exported. Verified present in notebook.glb. */
  nodes: {
    cover: 'NB_Hinge_Front',
    pages: 'NB_Hinge_Pages',
    spine: 'NB_Hinge_Spine',
  },
  /** Closed is the authored rest pose: every hinge at 0. */
  closed: { cover: 0, pages: 0, spine: 0 },
  /**
   * Open, in radians about Z. Covers and pages swing a full half-turn; the
   * spine tracks at half angle so it lies flat in the gutter instead of
   * standing up as a wall between the two halves.
   */
  // POSITIVE, and this sign is load-bearing in a way that hides from testing:
  // +pi and -pi give an IDENTICAL terminal pose for the covers and pages, so
  // any check of the final rest state passes either way. Only the PATH
  // differs. At -pi the covers and page block sweep 0.862 world units BELOW
  // the worktop - straight through the bench - for most of the arc, and the
  // spine lands inside the back cover's footprint instead of bridging the
  // gutter at x -1.185..-1.010. Verified by sweeping both signs across the
  // full arc against every part pair. Check the path, never just the endpoint.
  open: { cover: Math.PI, pages: Math.PI, spine: Math.PI / 2 },
  /**
   * ORDERING RULE, which is kinematics rather than styling:
   *
   *   theta_cover >= theta_spine * 2 >= theta_pages, at every instant, both
   *   directions.
   *
   * Pages may never lead the cover - the block physically cannot pass through
   * the board, and pages leading by 10% drives 0.124 model units of page
   * stack through it across five part pairs. The spine may never lag the
   * pages: its job is to bisect, sitting at half the board's angle so it stays
   * tangent to both, and lagging by as little as 5% puts PageStack_Left
   * through it.
   *
   * This is satisfied with NO magic numbers by giving the covers and spine
   * `--dur-move` and the pages `--dur-settle`, all starting together. The
   * pages then trail by construction (a measured 19.0 degree cover-over-pages
   * lead at peak) because settle is the longer token. Durations stay wholly
   * token-derived, per Invariant 1.6 and D13.
   */
} as const
