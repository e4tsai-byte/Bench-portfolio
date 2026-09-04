# Bench Portfolio

**An interactive 3D lab bench as a personal portfolio.** A stylized, high-key lab scene where four objects are alive: click the **microscope** to zoom into research, the **notebook** for publications and patents, the **calendar** for an interactive timeline, and the **computer** for AI projects. It is built to be explored, not skimmed. A traditional resume carries the fast-read load; this is the playground.

> This README is **live**. It is updated as development proceeds. The status table and build log below are the current truth of what is built, in progress, or planned. If a section here claims more than the repo can back up, that is a bug (see `CLAUDE.md` Invariant 1.9).

---

## Status

**Current phase: Phase 1 (vertical slice), in progress. Stages A through D are done, including the microscope console and the eyepiece-dive arrival. Hover-glow, onboarding, and deployment are still outstanding, which means Phase 1 is NOT shipped and live - and the notebook's opening flip was nevertheless built ahead of it by owner override, recorded as D28.**
**Last updated: 2026-09-04.**

Status vocabulary: **Planned** (designed, not built) · **In progress** (being built now) · **Implemented** (built and works) · **Live** (deployed and reachable) · **Placeholder** (stand-in art or data, not final).

| Component | Status |
|---|---|
| Product spec, design system, engineering contract, agent roster | **Implemented** (this repo's `.md` files) |
| Project scaffold (React + Vite + TypeScript, GSAP) | **Implemented** (toolchain only, no UI) |
| Design tokens (`styles/tokens.css`) | **Implemented** (verified in-browser) |
| Bench scene: real-time 3D scene + object selection | **Implemented**; the bench is now real lab furniture (`bench.glb`: worktop, casework, drawer pedestals, reagent shelf) |
| Hover-glow on objects | **Planned** |
| State machine + `#hash` deep links + Back-to-Bench | **Implemented** (verified in-browser); onboarding hint still **Planned** |
| Camera transitions (GSAP), reduced-motion path | **Implemented** (verified in-browser) |
| Eyepiece-dive MICROSCOPE arrival, whiteout, direct-link/reduced-motion safety | **Implemented** (verified in-browser) |
| Microscope console (viewfinder, specimen cards, HUD crosshairs) | **Implemented** (verified in-browser: disclosure, DOI link, keyboard path, empty state) |
| Research content (`content/research.ts`) | **Implemented** (3 items, real PDAC abstract, citation verified against Crossref) |
| Phase 2 content (`publications`, `patents`, `timeline`, `aiProjects`) | **Implemented** (data only; the views they feed are still **Planned**) |
| Owner's 3D models (`assets/models/*.glb`) | **Placeholder** (all four - `microscope`, `computer`, `notebook`, `calendar` - are exploratory low-poly drafts, wired and rendering) |
| Notebook object | **Implemented** (opening flip, camera arrival, and a two-leaf console: publications left, patents right — built by override, D28/D29) |
| Calendar / Computer objects | **Planned** (Phase 2, inert, hotspots do not navigate) |
| Deployment to Vercel | **Planned** |
| Mobile pass, sound, focus-knob, metric bars | **Planned** (later polish) |
| Render constraints (`DESIGN.md` Section 10) | **Implemented** (documented, blocking) |
| Automated design audit (`tools/audit.mjs`) | **Implemented** (static half); composite check (`tools/composite-audit.js`) adapted for the live canvas, still manual |

---

## The concept

A pristine, near-monochrome lab bench in cool blues and sterile whites, objects like specimens under glass. Four interactive objects:

- **Microscope → research.** Zoom into a viewfinder console where research items float as glass specimen cards. Phase 1 content: the PDAC / Schwann-cell whole-organ 3D histology work, plus other research.
- **Notebook → publications and patents.** A top-down archival spread, editorial and monochrome so the figures provide the only color.
- **Calendar → timeline.** A scrubbable chronology of experiences with a glowing "today" marker and pop-out deep dives.
- **Computer → AI projects.** A high-key terminal-style console presenting the code projects.

## What this is not

- **Not photorealistic.** The bench *is* a real-time 3D scene as of 2026-09-03 (see D20), but the look is stylized, high-key, and matte. "Photorealistic" is not a goal and stays retired.
- **Not a resume replacement.** It is a playground; the resume does the fast-read work.
- **Not dark mode.** The whole experience is high-key by law (`DESIGN.md`).
- **Not mobile-first.** Desktop-first by decision; a reduced mobile pass is later polish.

## Tech stack

- **React + Vite + TypeScript**, static build.
- **Three.js via React Three Fiber** for the single real-time bench scene (D20). `@react-three/drei` deliberately not installed, to keep the bundle down.
- **GSAP** (with Draggable and InertiaPlugin) for timeline-based motion: the camera moves, and later the focus-knob and calendar scrub.
- **No backend.** No server, no accounts, no secrets in the client.
- **Deploy:** Vercel, auto-building from `main`.

## Quickstart

```bash
npm install
npm run dev         # local dev server
npm run typecheck   # the real gate
npm run audit       # design-system gate: contrast floors, high-key law, tokens-only
npm run build       # production build (runs typecheck first)
npm run preview     # serve the production build
```

## Documentation

| File | What it holds |
|---|---|
| [PRODUCT.md](PRODUCT.md) | What the project is, who it is for, the phase plan, and content models |
| [DESIGN.md](DESIGN.md) | The visual law (high-key), the token system, and every component's rationale |
| [CLAUDE.md](CLAUDE.md) | Engineering invariants: the contract the code holds itself to, plus the decision record |
| [AGENTS.md](AGENTS.md) | The specialist-review roster used to develop this project |
| [IDEA.md](IDEA.md) | The original idea doc. Archival and superseded: read it for history, never implement from it |

## Scope and honest limitations

Stated here rather than buried.

1. **Greenfield.** As of 2026-08-31 the code does not exist yet; only the spec and docs do. The status table above is the source of truth.
2. **The 3D models are net-new work** and the one asset on the critical path (amended by D20; this was a Spline still-baking pass). Until they exist, the build runs on placeholder primitive geometry at the final transforms, and any placeholder in production is marked Placeholder above.
3. **Phase 1 wires the microscope, and now the notebook.** The notebook opens when entered, its hotspot navigates, and it has a real content view (D28/D29, an owner override of Invariant 1.7 taken before Phase 1 was live). The calendar and computer remain intentionally inert until Phase 2, with non-navigating hotspots and "coming soon" plaques.
4. **Desktop-only for now.** Mobile is a planned reduction, not a Phase 1 deliverable.
5. **Some decisions can only be settled by looking** (does the fake zoom convince, is the focus-knob worth building). Those are tracked as open questions in `CLAUDE.md` Section 7 and are deliberately not pre-decided.

---

## Build log

Newest first. Add a dated entry at the end of every phase or meaningful change, and update the status table above to match. This is the "live" part of the README.

### 2026-09-04 (the eyepiece dive: MICROSCOPE arrival ends in a real whiteout)

- **Built the eyepiece dive.** The MICROSCOPE arrival is now a three-leg camera timeline: the existing bench-to-head move, a re-alignment onto the ocular's own axis, and a committed push through the disc, ending fully white with no bench visible. Committed to the left ocular; the model's own geometry rules out a centred push. Full reasoning and the specialist review that planned it (motion-engineer on the choreography, brand-designer on the palette legality of a full-white terminal frame) recorded as D25 in `CLAUDE.md` Section 7.
- **The whiteout is a real `--ground-2` overlay plus a neutral emissive on `ms_eye_glow`**, not left to render precision alone, and it persists for the whole visit rather than fading back out, so "no bench visible" holds for as long as the user is there.
- **`camera.near` lowered from the R3F default (0.1) to 0.01.** The dive ends close enough to the disc that the default near plane would have clipped the terminal geometry away at exactly the moment it needed to fill frame. A real bug this feature exposed, not specific to the dive itself.
- **Found and discarded a wrong diagnosis, on purpose, because the story is worth keeping.** The first fix for a real bug (reduced motion and direct links wrongly showing the full whiteout) targeted React 18 StrictMode's double-invoke of initial-mount effects. That diagnosis was plausible and wrong, confirmed wrong by disabling StrictMode entirely and watching the bug persist unchanged. The actual cause: `location.hash` is not always synchronously readable on the very first render in this environment, so a direct link can genuinely commit `state: BENCH` before self-correcting to `state: MICROSCOPE` a tick later, a real second commit no mount-timing check can tell apart from an actual click. The fix that worked tracks whether MICROSCOPE was reached by an actual click (`hasUserNavigated`, set only inside the click handler) and gates the dive on that, not on any notion of "was this the first render." Full account in `CLAUDE.md` Section 7, D25, because the lesson (check what differs about the state SEQUENCE before reaching for a framework lifecycle explanation) outlasts this one bug.
- Verified in-browser across all four paths: a genuine click plays the full dive and ends white; a direct `#microscope` link lands instantly on the resting three-quarter view with no whiteout; forced `prefers-reduced-motion` does the same; and Back-to-Bench correctly returns from the white state and clears the whiteout.

### 2026-09-03 (the microscope console: Phase 1's actual payload)

- **Planned by two specialist reviews before any code**, per `AGENTS.md`'s stated pipeline: ux-designer for the viewfinder's information architecture and card behaviour, brand-designer for the legibility gate. Both produced binding constraints, recorded as D23/D24 in `CLAUDE.md` Section 7.
- **Built:** `three/palette.ts`-driven token colours throughout, `components/ViewfinderMask.tsx` (two-tier: a frost-free clear core, an outer `--frost-1` ring), `components/HudCrosshairs.tsx` (static, non-reactive, per the design review's own reasoning for why reactive HUD chrome would read as broken instrumentation), `components/SpecimenCard.tsx` (a real `<button>`, keyboard-reachable for free), and `scenes/Microscope.tsx` orchestrating an inline single-select disclosure over `content/research.ts`, with `Escape` collapsing a card without leaving the state and BackToBench remaining the sole exit throughout.
- **The DESIGN.md 10.2 quiet-zone rectangle does not hold for the original camera framing, measured directly rather than assumed.** The generic 76%x68% rectangle sampled at the live `MICROSCOPE` state gave a flatness range of 119 to 202 levels against a 12-level limit. Root cause: a stage-plate material mapped to `--ink-1` (a text-tier token) sat directly in the framed centre. The camera was retargeted from the stage/illumination cluster to the binocular head, and a correctly-sized circular region there measures mean 226, min 220, range 11, clearing every floor. This is the concrete confirmation that DESIGN.md 4.4's circular mask is not optional styling: the rectangle genuinely fails where the circle genuinely passes, exactly as the brand-designer review predicted before any pixel was measured.
- **Two real bugs found by testing, not by reading the code back.** First, camera targets were briefly computed from a `.glb`'s raw glTF node translations (model space, pre-normalisation) rather than the object's known world-space height, aiming roughly 2.5x too high. Second, `.specimen`'s width rule silently lost to an earlier `button.card { width: 100% }` rule (element+class beats a bare class regardless of source order), stacking all three cards full-width. Both are now fixed with the underlying mechanism understood, not patched with `!important`.
- **`tools/composite-audit.js` adapted for the live canvas**, per the brand-designer review's own spec: samples `.scene__canvas canvas` at 1:1 (no crop math, since the canvas is not `object-fit` cropped like the old baked still), and paints the actual page ground behind the canvas's transparent pixels before blurring, since a naive read of a transparent WebGL buffer reports false-black rather than the composited colour a real viewer sees. Documents that a temporary `preserveDrawingBuffer` flag and a post-settle wait are required before running it, since the live buffer can be blank or stale outside the same tick as a paint.
- **Verified in-browser, not asserted:** disclosure toggling (via direct DOM interaction, since synchronous reads after a native `.click()` predate React's batched re-render and produce false negatives, a real gotcha worth recording), the DOI link resolves to the Crossref-verified URL and opens in a new tab, `Escape` collapses without changing state or hash, and Tab order is BackToBench then the three cards in array order with no trap.
- **Two items deliberately deferred, flagged rather than silently skipped:** `frameloop="demand"` (R3F runs a continuous render loop even with the camera at rest; a real but separate performance question) and a Safari-specific check of `backdrop-filter` over a `<canvas>`, which has a known history of being less reliable there than over Chromium.

### 2026-09-04 (D29: the notebook's content view)

- **The notebook has a real view.** Publications on the left leaf, patents on the right - two panels sized and placed over the open spread so the gutter, the fore-edges and the D26 quadrille still show around them. Titles are disclosure controls; expanding one reveals authors, contribution, tags and the DOI link.
- **Deviates from `PRODUCT.md` Section 11 on purpose.** That spec asks for "table of contents left / document viewer right". With one publication and three patents, an index is a thin use of a whole page and adds a selection state the content does not need. The spread already has two pages, so each collection takes one. `PRODUCT.md` is updated rather than left contradicting the build.
- **DOM, not texture, and not projected onto the page.** DESIGN.md 10.6 allows generated surface markings only while nothing meaningful exists solely in the render - canvas text is invisible to assistive technology, and a patent number is exactly the meaningful case. The panels are placed once in viewport units against a camera state that does not move: static composition, not the per-frame registration D20 deleted.
- **An empty patent number renders as "no number issued".** `patents.ts` leaves the U.S. provisional blank because the source gives none, and Invariant 1.5 makes that an accuracy question, not a formatting one.
- **I had to correct a claim I made yesterday in three files.** D28, this README and `PRODUCT.md` all said `#notebook` renders the coming-soon plaque. It never did - promoting NOTEBOOK moved it to the `isWiredThisPhase` branch, which rendered a bare `state / notebook` placeholder. Caught by reading the DOM, not by reasoning. The correction is recorded in D29 rather than quietly edited away, because a plausible outward claim nobody checked is the exact Invariant 1.9 failure mode.
- **Measured, not asserted:** composite audit in the NOTEBOOK state with an entry expanded returns **PASS, 18 elements, 0 failures** (mandatory under 10.7); Escape collapses an entry without exiting (D23); Back-to-Bench present in every frame; typecheck and audit clean with no new warnings.
- **Unchanged:** calendar and computer remain Phase 2 and inert. Hover-glow, the onboarding hint and the Vercel deploy are still outstanding, so Phase 1 is still not shipped and live and D28's recorded risk stands.

### 2026-09-04 (D28: the notebook's opening flip)

- **The notebook opens when you enter it.** Clicking it flies the camera in, holds, and the three-hinge rig unfolds the book to a flat spread while the camera watches from outside. Built at the owner's explicit direction over a phase-discipline objection, recorded as **D28**; Invariant 1.7's own text is amended in place rather than left contradicting the repo.
- **Deliberately not an echo of the eyepiece dive.** An ocular is a thing you put your eye to, so diving in is what looking down one actually does; a book opening is an event performed on an object you watch. Diving here would also have destroyed the `ms_page` quadrille (D26) at the exact moment it finally became visible for the first time - which, per `wip/README.md`, had never been seen in the running app until now.
- **The rotation sign was wrong first time, and the bug hid from the obvious test.** `+pi` and `-pi` give an *identical terminal pose* for the covers and pages, so the book ended up correctly open either way and any endpoint check passed. Only the path differed: at `-pi` the covers and page block swept **0.862 world units below the worktop**, through the bench, for most of the arc. Caught by specialist review sweeping the full arc rather than by looking at the result. Check the path, never just the endpoint.
- **Two live defects fixed on the way, neither caused by this work.** `CAMERA_STATES.NOTEBOOK` aimed 0.274 units *above* a book 0.076 units tall, so `#notebook` framed mostly empty worktop - D24's bug class again. And the spread would have opened straight through the laptop: 0.868 world units of intersection, fixed by turning `OBJECT_FACING.NOTEBOOK` 180 degrees so the book opens into clear space, which costs a constant rather than a re-export.
- **Timing is entirely token-derived.** Covers and spine ride `--dur-move`, pages ride the longer `--dur-settle`, all starting together, so the pages trail *by construction* rather than by a hand-tuned offset. An earlier draft used magic fractions (`move * 0.9`, a 0.08/0.14 stagger); those were Invariant 1.6 / D13 defects and are gone.
- **Verified, not asserted:** the flip on click; the flat spread with the grid visible; **composite audit PASS with 0 failures in the new NOTEBOOK camera state**, which DESIGN.md 10.7 makes mandatory; a direct `#notebook` link landing already-open with no flip; `prefers-reduced-motion` cutting straight to the open book; and Back-to-Bench closing it so the bench is never left with an open book.
- **A specialist correction that turned out to be wrong, checked rather than trusted.** Review claimed `computer.glb` measures 0.680 wide (making the collision smaller) and that the laptop floats 0.2875 units above the worktop. Recomputed with node rotations applied: W 3.142, H 2.217, scale 0.3519, world width **1.106**, spanning -3.603 to -2.497, lowest point `Foot_LB` at -0.014. The original figures stand and the laptop does not float; the correction came from a bounding box computed without rotations.
- **Still not built at the time of that commit:** the Notebook content view. **Built the same day (D29).** The claim in this entry that `#notebook` lands on the coming-soon plaque was also wrong when written - promotion had already moved it to the `isWiredThisPhase` branch, which rendered a bare `state / notebook` placeholder. Corrected rather than left standing.

### 2026-09-04 (D27: the bench becomes a real lab bench)

- **The flat slab is now real lab furniture.** `bench.glb`: a dark epoxy worktop, white casework with end panels and legs, three mobile drawer pedestals on casters, and a reagent shelf with rails and service fixtures. 984 triangles across 62 parts, 102K. Built from an owner-supplied reference photograph.
- **The dark worktop is a recorded exception to the high-key law, not a reinterpretation of it.** Invariant 1.1 says a dark surface is a defect and DESIGN.md 10.1 sets a 203 luminance floor; the worktop is `--ink-1` and clears neither. Recorded as **D27 / DESIGN.md 10.7** after being put to the owner explicitly with the cost stated.
- **Measured, because describing a black-topped bench as "high-key" would be exactly the claim Invariant 1.9 exists to stop.** On the live `BENCH` render: minimum 45, mean 178, maximum 252, with **48.8% of opaque pixels below 203**.
- **What that floor protects was measured separately and holds.** `tools/composite-audit.js` reports the worst pixel under each text element against the live canvas: **PASS, 0 failures** in `BENCH` (9 elements) and `CALENDAR`. The consoles sit over white casework and page ground rather than over the worktop. The blanket floor is broken; the legibility it proxies for is intact - which is the whole justification, and why 10.7 makes the composite audit **mandatory for any new camera state** rather than treating this pass as general.
- **Only the worktop needed a ruling.** The reference's saturated blue casework became `--ink-2`; the ink family is already hue 213 cool blue-grey, so no second accent hue is introduced and Section 2.3 / D16 stay intact.
- **`bench.glb` deliberately bypasses `Model`**, which seats a model's base at y=0. The bench's *worktop* defines y=0, since that is the plane the four objects stand on, so it loads at scale 1 through a small `LabBench` component. Material application was extracted into an exported `applyTokenMaterials` so the bench cannot become a second, unpoliced source of colour.
- **Two composition fixes found by looking.** The reagent shelf's rails cut straight across the microscope's head at the first attempt; the shelf was lifted so its lowest rail (1.52) clears the microscope (1.45). And the `BENCH` camera was reframed from `[0, 2.6, 7.2]` to `[0, 4.3, 11.6]`: the old slab had no vertical extent, while the bench spans about 6.4 units floor-to-shelf and overflowed a frame built only to hold a tabletop.

### 2026-09-04 (D26: runtime-generated object surfaces)

- **`DESIGN.md` 10.3's "no baked UI" rule now permits markings generated at runtime from tokens**, recorded as new **`DESIGN.md` Section 10.6** with the reasoning in `CLAUDE.md` D26. This closes the gap the calendar opened the same day rather than leaving the model depending on an unrecorded exception.
- **The load-bearing word was always *baked*.** 10.3 says so itself: "baking it makes it un-tokenizable". A pattern drawn from `three/palette.ts` at runtime is not baked, keeps `tokens.css` as the single source of truth, restyles itself if a token moves, and ships no image bytes (which D21 wants anyway). The baked case stays exactly as prohibited.
- **The permission is narrow, and the boundary is object-versus-interface**, not decorative-versus-functional. A notebook's ruling and a calendar's month grid belong to the object as a physical thing. HUD marks, focus rings, glow rings, plaque type, and callouts stay forbidden **by any means** - generating them into a texture rather than baking them would evade 10.3's letter while defeating its purpose.
- **Accessibility is the hard limit, and the reason this is not an open licence.** Canvas text is invisible to assistive technology, unselectable, unsearchable, untranslatable. 10.6 therefore requires that nothing meaningful exist only in the render. The calendar's numerals qualify precisely because they say nothing a user needs. Real content on an object must also exist in the DOM, where Section 3 governs it.
- **The geometric alternative was rejected on a measurement, not an argument.** Ribs at the bench camera project to roughly 0.6px - present in the file, invisible on screen. That is the third time this project has hit the same wall (laptop keycaps, notebook page block), and the first two were caught only by rendering and looking.
- Code comments in `Model.tsx` updated to cite 10.6 rather than an outstanding amendment. Two generated surfaces exist; a third needs its own ruling.

### 2026-09-04 (calendar model, and the surface-pattern capability)

- **`calendar.glb` completes the set.** All four bench objects now have real models. An A-frame tent desk calendar matching the placeholder's silhouette: two leaning panels, spiral binding across the apex, and a printed face. 228 triangles across 16 meshes, 26K - the cheapest object on the bench by a wide margin, because almost everything that makes it read as a calendar is drawn rather than modelled.
- **Built from a written spec, the second model done that way.** The requirements were interviewed out and compiled into a master prompt first. One instruction in that prompt was then deliberately overridden: it said make the grid geometry rather than texture, on the grounds that no texture capability existed. It exists now, and thin ribs would have been roughly 0.6px at bench scale - invisible, the exact failure the keycaps and the page block already taught. Texture was the right instrument once it was available.
- **`Model.tsx` gained a `surface` field** (committed separately, [c14707e]): patterns are generated at runtime into a canvas from palette colours, never baked into the `.glb`. Two kinds now - `quadrille` for the notebook's ruled pages, `calendar` for this face. `palette.ts` gained `readFonts()` for the same reason colours are read there: a hardcoded font stack in a material is the same class of defect as a raw hex.
- **This is the first thing in the render that draws text, and DESIGN.md 10.3 forbade exactly that.** The rule reads "No text ... in the render. All of that is CSS driven by tokens, and baking it makes it un-tokenizable." Runtime generation from tokens satisfies that stated *reason* but not the literal wording. The gap was flagged rather than quietly assumed, and **closed the same day by D26 / DESIGN.md 10.6** (see the entry below).
- **The face rendered upside down first time.** The exported UVs were verified correct in Blender (u tracks +X, v tracks +Z), so the fault was the texture's default `flipY` landing canvas-top at v=0. Fixed at the texture, not by rotating geometry that was already right. Upside-down text reads as mirrored at bench resolution, which is what made the diagnosis look harder than it was.
- **`npm run audit` caught a real violation of mine:** `ctx.letterSpacing = '0px'` as a raw px in a component (Invariant 1.6). It is a canvas state reset rather than a design value, but the audit cannot tell those apart and is right not to try - replaced with `save()`/`restore()`.
- The numerals are decorative: a generic 30-day month, no year, no real date implied, so nothing here makes an outward factual claim (1.9).
- **Invariant 1.7 untouched.** Asset only: the Calendar hotspot still does not navigate and `#calendar` still renders the coming-soon plaque.

### 2026-09-04 (notebook model: `notebook.glb`, rigged to open)

- **Sewn hardcover lab notebook**, exported closed, with a three-hinge rig that drives to a flat 180-degree spread. 624 triangles across 16 meshes, 43K — by far the cheapest object on the bench.
- **Built from a written spec rather than from the request directly.** The owner asked for the requirements to be interviewed out first, then compiled into a single build prompt. Three rounds of questions settled twelve decisions before any geometry existed, and two of them changed the design: the cover "title" is a blank recessed label panel because DESIGN.md 10.3 forbids text in a render, and the pages get a runtime-generated grid rather than a baked texture.
- **The rig needed three pivots, not one.** A single hinge was specified and it was wrong. Covers must swing on a wider radius than pages, or the flattened spine has nowhere to lie; with one pivot the spine stayed vertical and read as a wall down the middle of the open spread. Final rig: `NB_Hinge_Front` at x -1.085 (covers), `NB_Hinge_Pages` at x -0.985 (page halves), `NB_Hinge_Spine` at x -1.010 (spine, tracking at half angle). At -180/-180/-90 the spread lands flat, both leaves level at z 0.0872, nothing below the desk. Verified by measuring world bounds, not by eye.
- **The page block took two attempts.** Ten leaves per half separated by 0.13mm gaps rendered as a solid white band — the striation was there and completely invisible. Eight thicker leaves with irregular fore-edge insets (bound edge stays aligned, free edges vary up to 0.0095) reads unmistakably as stacked sheets. The lesson matches the laptop's keycaps: at bench scale, separation has to be coarse enough to survive projection.
- **`ms_page` is a new material name, and deliberately not `ms_slide`.** The two spread leaves carry UVs and will take the quadrille grid; the microscope's specimen slide uses `ms_slide`, so reusing it would have put a grid on the microscope.
- **`OBJECT_HEIGHT.NOTEBOOK` moved from 0.12 to 0.076.** Normalisation is by height and a notebook is thin, so correct proportions (1.995 x 2.640 x 0.175) scale to 1.37 x 1.81 on the bench at 0.12 — nearly double the placeholder's 0.78 x 1.05, on the already-crowded left side. Real proportions kept; the constant moved.
- **Deviation from the spec, recorded:** the ribbon is static rather than parented to the cover hinge. A bookmark is anchored at the spine and lies on the page; parenting it to the cover would have flipped it away with the left half. Only the visible part is modelled, from the fore-edge outward, so it never intersects the block.
- **Invariant 1.7 untouched.** The rig ships unwired: no hinge is driven, the Notebook hotspot still does not navigate, `#notebook` still renders the coming-soon plaque. Driving the open animation is Notebook-view work.
- **Not built yet:** the runtime quadrille grid. Pages are blank ground-2 until it lands, deliberately kept as its own change since it is a capability addition to the loader, like the `emissive` support was.

### 2026-09-04 (laptop model: `computer.glb`)

- **The computer object has a real model.** A MacBook-shaped laptop in the open state, built procedurally in Blender: bevelled unibody base, booleaned keyboard well and trackpad recesses, hinge barrel, feet, side ports, and a lid on a pivot at 105 degrees from the deck. 3,960 triangles across 17 meshes, 240K on disk — the bevelled keycaps are 3,432 of that, which is most of the model.
- **The keyboard is complete: all 78 keys**, at true MacBook proportions (19mm pitch, 3mm gaps, scaled). Function row at half height, 1.5u tab, 1.75u caps and return, 2.25u shifts, 5u space, and the inverted-T arrow cluster with half-height up/down. Every row totals 14.5u, so the rows align exactly as a real keyboard does.
- **No glyphs on the keycaps**, deliberately. `DESIGN.md` 10.3 forbids baked UI — text in the render cannot be tokenised, so "fully completed" here means every key modelled at the correct size and position, not lettered.
- **The keys were invisible on the first pass**, and the fix is worth recording. Keycaps on `ms_knob` (ink-2) against a well floor on `ms_stage` (ink-1) are only one ink tier apart, so the keyboard rendered as one slab with hairline slits. Moving the caps to `ms_shell_dark` (ink-3) put two tiers between cap and well, and a 0.006 bevel gives each cap an edge that catches the key light. A real MacBook's near-black keyboard was never available: Invariant 1.1 makes a dark surface a defect, so the keyboard is the palette's ink tiers inverted, light caps in a darker well.
- **No code change was needed to wire it.** All five materials it uses (`ms_shell`, `ms_shell_dark`, `ms_metal`, `ms_slide`, `ms_stage`) were already in `Model.tsx`'s `MATERIAL_MAP`, and it was authored front-toward-Blender-minus-Y so it exports facing glTF +Z, which is what `OBJECT_FACING.COMPUTER = 0` already expects. It normalises to 1.106 wide at the declared `targetHeight` of 0.78, against the placeholder's 1.1. Verified in-browser: loads, maps, no unmapped-material warning.
- **Invariant 1.7 is untouched.** This is a model, not a view: the Computer hotspot still does not navigate, `#computer` still renders the coming-soon plaque, and no console exists. Same reasoning as D18 — an asset carries no view, wires no hotspot, and answers none of the feel questions Phase 1 exists to settle. `computer.glb` is a filename Invariant 1.3 already declared.
- **Bench transform corrected.** `COMPUTER` moved from x -3.7 to -3.05, with its camera state shifted by the same delta so the object and its view stay in register. The model normalises to 1.106 wide against the placeholder's ~1.1, but the placeholder was a closed wedge and this is an open laptop, so it reads far wider: at -3.7 its left edge sat within 0.3 units of the frustum edge at 16:10 and clipped on anything narrower.
- **Checked a suspicion instead of acting on it.** The calendar looked clipped on the right in the same frame. It is not: both notebook and calendar placeholders are 0.78 wide, so the calendar spans 2.01 to 2.79 and is comfortably inside. Reading it off pixels was wrong; reading it off the geometry settled it. No change made there.
- **Still open, and this fix does not close it:** the bench framing is tuned for wide desktop. At 16:9 and 16:10 all four objects now clear the frame, but the camera is a fixed `[0, 2.6, 7.2]` at fov 35, so aspects at or below 4:3 still crop the outer objects. The real fix is an aspect-responsive camera distance, not more transform nudging.

### 2026-09-03 (D22: broad-surface luminance ceiling raised)

- **`DESIGN.md` 10.3's broad-object-surface peak moves from 235 to 245**, at the owner's request. The reasoning behind 235 (headroom for a hover/active brightness bump) was written for the pre-D20 pipeline, where the render was a baked still and the bump was a CSS filter over it. Checked before writing this: no hover or glow effect exists anywhere in `three/` or `components/` yet, for the microscope or for the coming-soon glow on the Phase 2 objects (Invariant 1.7). The number is provisional until one is built and measured against it.
- **245 was not invented for this.** It is the top of the existing `DESIGN.md` 10.1 composite target range, so reusing it kept the change to two dependent bullets in 10.3 (the ceiling itself, and the baked-glow ramp's floor moved to match) rather than new luminance math.
- Recorded as `CLAUDE.md` D22, with an inline amendment note on D16 rather than an edit to D16's own text, matching how this file treats superseded figures elsewhere. `Model.tsx`'s two comments citing 235 are corrected; `wip/README.md`'s historical measurements (251 peak / 12.42% over, taken against the 235 ceiling in effect then) are left as they were, since rewriting a past measurement to match a later rule would misstate what was actually measured.

### 2026-09-03 (binocular head, built for the eyepiece transition)

- **The microscope now has a dual eyepiece.** A prism housing with two tubes splayed 11 degrees, each a lathed eyecup with a real bored aperture and a bright disc seated at the bore floor. Built because the zoom-into-the-eyepiece transition needs something the camera can actually enter; the previous single ocular was a solid cylinder with a lens disc perched on top, with nothing to fly into.
- **Fixed a defect the rebuild exposed.** In the single-ocular model the eyepiece was never coaxial with its tube: the tube's mesh axis ran `(0, -0.53, 0.848)`, leaning backward, while the eyepiece sat on `(0, +0.53, 0.848)`, leaning forward, 0.64 apart in Y. Earlier sessions had been closing the visible seam with overlap tweaks, which treated the symptom. Both tubes are now built on pivot empties, so each axis is defined once and the tube, eyecup, bore disc, and target all inherit it.
- **The bore is bright, not black, and that was a judgement call.** A real ocular bore is dark, but Invariant 1.1 makes a dark surface a defect, and pushing into a black hole would flash dark immediately before landing on a luminous white console. The bore floor is therefore the brightest tier available, so the push-in resolves white-on-white. One material entry to reverse.
- **A centred push has no target, and the model cannot fix that.** Tested in Blender: a camera aimed between the two oculars passes *between* the tubes at close range and ends on the prism housing, both bores diverging out of frame. A binocular head has two apertures and solid metal between them. Aiming down one ocular gives a single bright disc filling the frame. The transition has to commit to one side, or fire the crossfade early while both discs are still in view. The model ships `Eyepoint_L`, `Eyepoint_R`, and a centred `Eyepoint_Target` as `.glb` nodes so the rig can choose; **none of them is wired yet.**
- **`ms_eye_glow` is mapped, and does not glow.** It takes `--ground-2`, the brightest tier, which needs no waiver because D16's 235 ceiling governs *broad* surfaces and this is a small disc. But it was authored emissive in Blender and `Model.tsx` rebuilds every material from tokens, so emission is discarded along with all other baked properties. It renders as the brightest flat tier, not as a light source. Making it actually emit needs an emissive field on `MaterialSpec` or a light seated at the bore, and that is a decision, not a side effect.
- Triangles went 784 to 2,244; the two lathed eyepieces are the whole cost. 31 meshes, 5 empties, 140K on disk.
- **Unverified:** the bore disc's luminance at the transition's endpoint, which cannot be measured until the transition exists and the camera actually gets there.

### 2026-09-03 (model promoted to main)

- Merged `wip/blender-microscope-model`. `microscope.glb` is on `main` and in the build.
- **Checked the promotion against the bar `wip/README.md` set, rather than treating "merge" as a waiver.** Three of its four conditions were satisfied by the token mapping and the filename contract. The fourth, the `DESIGN.md` Section 10 luminance rule, **had not been checked and failed when it was.**
- **The measured failure:** with the shell mapped to `--ground-2` (pure white), the rendered peak was 251 with **12.42% of object pixels above the D16 ceiling of 235**, which would have left the CSS hover glow no headroom. Cause was mine, not the model's. Broad surfaces moved to `--ground-1` and the lighting rig trimmed: peak now 248 with **1.27% over 235**, all of it small specular and lens area, and zero clipped pixels. Zero warm pixels, so blue is greater than or equal to red everywhere.
- Measured with a temporary `preserveDrawingBuffer` flag, since a WebGL context discards its buffer after compositing and `readPixels` returns nothing. The flag has a real performance cost and was reverted.
- `wip/README.md` now records the promotion and answers each of its own checklist items, including the one it did not anticipate: the model was authored facing -Z.
- **Still unmeasured, and stated rather than glossed:** the whole-frame mean in Section 10.1 (the figures above cover rendered geometry only, not the composite with the page ground), and the Section 10.2 console legibility check, which needs the microscope console to exist.

### 2026-09-03 (first model wired)

- **`microscope.glb` is in the scene.** The owner's exploratory low-poly Blender draft moved from `wip/` into `src/assets/models/` and now renders in place of the primitive.
- **Implemented the Invariant 1.3 swap for real** rather than describing it. `Model.tsx` discovers models with `import.meta.glob`, so dropping `microscope.glb` into `src/assets/models/` replaces the primitive with no code change, and deleting it brings the primitive back.
- **Materials are mapped by name, not flattened.** A `.glb` carries baked colours and knows nothing about `tokens.css`, so the model's material *names* are treated as the contract and their colours come from the token bridge: the author decides which parts differ, the design system decides what colour they are. An unmapped name logs a loud warning rather than being silently accepted. All seven of this model's materials mapped cleanly, and its authored colours were already cool throughout (blue >= red), so it was on-brief before any correction.
- **Models are seated, not trusted.** Scale is normalised to a target height and the base seated at y=0 from the model's own bounding box, so a re-export at a different scale or with a drifted origin still drops in without re-tuning camera states.
- **Found a gap in my own model brief: facing.** The brief specified origin and up-axis but never which way an object should face, and this model was authored facing -Z, so the bench view showed the back of the instrument. The convention (front faces +Z) is now documented in `PRODUCT.md` Section 9 and `DESIGN.md` Section 10.4, with a compensating rotation in `BenchScene.tsx`, because facing is the one thing code cannot infer.
- **`npm run audit` caught my own structural drift**, failing the build because `Model.tsx` was not in the `CLAUDE.md` Section 2 tree. Working as intended.
- Retuned the microscope camera state against the real model. Final framing still needs a pass at a true desktop aspect ratio.

### 2026-09-03 (D20 follow-up: finish the doc sweep)

- **Swept every governing doc for text D20 left false.** The headline sections were rewritten when the switch landed, but the trees, the agent roster, the component descriptions, and the acceptance criteria still described a pre-baked project. `PRODUCT.md`, `CLAUDE.md`, `DESIGN.md`, `AGENTS.md`, and this file are now consistent with the code.
- **Corrected a wrong number inside a binding decision.** D20's reasoning cited "roughly 180kb gzipped" for three.js plus React Three Fiber as a point in the switch's favour. The measured cost is 323.65kB gzipped, up from 61kB, so about 263kB added. The build log had the correction but the decision record did not, which meant the contract was justifying a decision with a figure that was never true. D20 now states the measured number and says plainly that the bundle argument was at best neutral.
- Retired `components/Transition.tsx` from both trees. It was never built, and the crossfade it described is now a camera move in `three/CameraRig.tsx`. D13's pointer to it, for where the GSAP ease strings live, is corrected to the same place.
- Reframed open question 1. It is no longer "does the 2D fake convince" but "is the live camera move good enough to keep, or should stills be captured from this scene and fed to the retained fallback". It is now answerable by looking, which it was not before.
- `PRODUCT.md` Section 14 kept as the original plan of record with each item marked done, superseded, or outstanding, rather than rewritten to look as if it had always said the right thing.
- Marked `PRODUCT.md`'s header status honestly (it still claimed "Greenfield, empty repo") and noted that where it and `CLAUDE.md` disagree, the decision record wins.

### 2026-09-03 (D20: the bench becomes one real-time scene)

- **Overturned the pre-baked-stills form of Invariant 1.2.** The bench is now a single real-time Three.js scene via React Three Fiber, with one camera state per bench state. Recorded as D20, superseding the asset half of D2, D5, and D6.
- **What decided it:** the owner authors and iterates the 3D files. On the baked path every model tweak cost two re-exports, an overlay registration check, a contrast re-verification, and two large binaries committed to a public repo. On this path it costs a file drop and a refresh. The entire fake-zoom apparatus (identical camera positions, FOV-only changes, hand-computed scale factor and transform origin) also disappears, and one scene with one lighting rig makes master-to-object consistency structural rather than verified per export.
- **Cost of the switch, measured not estimated:** zero lines of `src/` touched art, verified by grep. Stages A, B, and C survived intact. This was the cheapest moment the switch would ever cost.
- **Baking is retained as a documented fallback, not deleted.** Stills can be captured from this same scene at any time. Open question 1 is exactly the kind of thing that must be settled by looking, so a bad answer should cost a capture, not a rebuild.
- Added `three/palette.ts`, the **token bridge** (D21). Materials and lights are set in JavaScript where nothing enforces the palette, so the scene reads its colours from the CSS custom properties at runtime and `tokens.css` stays the single source of colour. It throws loudly on a missing token rather than falling back, because a scene rendered in fallback colours would look plausible while being off-palette.
- Added a **keyboard route into every object**. The canvas is pointer-driven, so without it there was no keyboard path in at all, which would fail `DESIGN.md` Section 3 item 3.
- **Verified in-browser rather than asserted:** the camera reaches its specified state exactly (measured, not eyeballed), state and `#hash` and Back-to-Bench all stay correct through a transition, and with `prefers-reduced-motion` forced on, the camera cuts straight to the destination on the very next frame instead of travelling (Invariant 1.8).
- **Honest cost:** the gzipped JS bundle went from 61 kB to 324 kB. That is roughly 80 kB more than the estimate given when the switch was proposed, and the estimate should not be treated as having been right. It is still plausibly smaller than two 3200x1800 PNGs, but it is a real regression in load weight and code-splitting the canvas is an open follow-up.
- Two failures during the work were **environment, not code**, and are recorded so they are not re-diagnosed later: an "Invalid hook call / more than one copy of React" crash was a stale Vite dependency pre-bundle, because the dev server had been started before `three` was installed (fixed by clearing `node_modules/.vite` and restarting), and an apparently mis-framed camera turned out to be a screenshot captured mid-transition.

### 2026-09-03 (content, part two)

- **The real PDAC/Schwann-cell abstract landed**, supplied verbatim by the owner, closing the last Phase 1 content gap. It is stored unaltered with an instruction not to paraphrase it: it is a scientific claim in its author's own words.
- **Filled all four Phase 2 content files** on the owner's instruction: `publications.ts`, `patents.ts`, `timeline.ts`, and `aiProjects.ts`. Recorded as D18. This does not touch Invariant 1.7, whose stated reason is that Phase 1's feel questions must be settled by looking before the view pattern is replicated. A typed data file carries no view and wires no hotspot, and the Phase 2 objects remain unbuilt. `CLAUDE.md` Section 4 was amended rather than left contradicting the repo.
- **Extended three of the `PRODUCT.md` Section 10 shapes** (D19), all with optional fields so nothing declared was broken. The shapes could not express real information that exists: what the owner did on a paper, where a patent is granted and what it does, and whether a timeline entry is a point-in-time award or a spanning role. `PRODUCT.md` Section 10 now matches the code.
- **Awards have no content model.** Section 10 defines five shapes and none is an award, yet there are four to show. They live in `timeline.ts` under `kind: 'award'` rather than being dropped or given an undeclared sixth file. A dedicated model would be a deliberate `PRODUCT.md` change.
- **One unsourced value, flagged rather than hidden** (Invariant 1.9): the UCSD start date of `2025-09` is inferred from the expected Jun 2029 graduation, since the resume states only the graduation. Marked inline in `timeline.ts` and awaiting the owner's confirmation.
- **`BioTechathalon` confirmed correct** by the owner and left exactly as written.
- No contact details in any content file. Verified by sweep. City-level locations are included, matching what the resume already states publicly.

### 2026-09-03 (content)

- **Populated `src/content/research.ts`** with three items transcribed from the owner's 2026 resume: the Academia Sinica Schwann-cell / PanIN 3D histology work, the Cancerfree Biotech co-culture and hardware work, and the genital psoriasis systematic review. The resume is the owner's own authoritative statement of these claims, so it satisfies Invariant 1.5. Nothing was inferred or embellished.
- **No contact details were committed.** This repository is public and the resume header carries a phone number, so no phone, address, or contact information of any kind entered the repo. Verified by sweep.
- **The `abstract` field is honest about what it holds.** `PRODUCT.md` Section 10 specifies it as full abstract text. What is there is an expanded description drawn from the resume, because the genuine PDAC/Schwann-cell abstract has still never been supplied. The field is documented as a known gap rather than padded to look finished.
- **Publication status resolved, and verified rather than taken on trust.** The resume carried only the manuscript number `BJD-2024-1480.R1`, a revision identifier, which was flagged as not safe to present as a final citation. The owner supplied the DOI, and it was checked against Crossref: `10.1093/bjd/ljae370`, British Journal of Dermatology 192(2), 357 to 359, published 2024-09-30, with the owner listed as third author. Volume, issue, pages, and date came from the publisher, not from the resume, which did not have them.
- **One inferred value corrected by that check.** The systematic review's `org` had been inferred from context rather than sourced. Crossref shows the study is based in the Department of Dermatology at Chang Gung Memorial Hospital, Linkou, and the field now says so.
- **Still flagged for the owner** (Invariant 1.9): one award name in the source reads `BioTechathalon`, left exactly as written rather than silently corrected.
- Phase 2 content files (`publications.ts`, `patents.ts`, `timeline.ts`, `aiProjects.ts`) remain unpopulated, per `CLAUDE.md` Section 4. The resume now contains everything needed to fill all four whenever their phase arrives.

### 2026-09-03

- **`DESIGN.md` gained Section 10, render constraints.** Sections 1 to 9 govern the interface and silently assumed the imagery underneath it, which does not survive contact with the material: the framed still is not a picture, it is the backdrop a translucent console must stay legible against, and Section 2.5 forbids every CSS remedy for a bad one. Section 10 carries the luminance law (hard floor 203 under a console, 215 to 245 target), the quiet-zone rule, the light and glow constraints, and the sRGB export requirement, all derived from the committed token values rather than estimated. Recorded as D15.
- **Three render rulings arbitrated** between scene-artist and brand-designer, resolved in favour of the blocking authority on palette: bloom off, no mint anywhere in the render, and broad object surfaces peaking at 235 so the CSS hover glow has headroom. Recorded as D16.
- **Added `tools/audit.mjs`, run as `npm run audit`.** It enforces the token contrast floors against every ground, the high-key law, the tokens-only rule in components, the fixed stylesheet load order, and structural drift against the Section 2 tree. Verified as a real gate the same way typecheck was: lightening `--ink-1` to a plausible-looking grey and darkening a ground both produce failures and a non-zero exit, and restoring returns it to green.
- **The `CLAUDE.md` Section 3 KNOWN GAP is narrowed, not closed, and says so.** The composite check cannot be static: text sits on a translucent console over a *blurred* still, `backdrop-filter` has no static equivalent, and no render exists yet. That half lives in `tools/composite-audit.js`, pasted into the dev console by hand, and is written to report the **worst** pixel under each text element rather than the mean, because the mean is what lets a bad render pass. A manual browser check remains mandatory for any change to `tokens.css` or a console surface.
- Published the Spline production walkthrough (scene setup, lighting rig, camera framing for the fake zoom, export settings, placeholder prompts, and the reject list) as a shareable page for the owner. The filename contract is settled: `bench-master.png`, `microscope-framed.png`, plus three Phase 2 names.

### 2026-08-31 (Stage C)

- Built the navigation spine: `state/benchMachine.ts` and `components/BackToBench.tsx`, with `App.tsx` mounting the machine. No router, per Invariant 1.4. No art and no content: the per-state bodies are labelled placeholders that Stage D replaces.
- **Arbitrated a genuine conflict between two invariants** (D14). 1.4 says no state may be unreachable; 1.7 says three of the five are not wired until Phase 2. Resolved by separating reachability from bench-wiring: all five states are reachable by hash and exitable, while the three Phase 2 objects do not navigate from the bench and render the "coming soon" plaque instead. Phase membership lives in one map so Phase 2 is a one-line promotion.
- **Found and fixed a real bug by looking.** Hash normalisation was written as a mount-only effect, which silently does nothing on a same-document navigation: changing only the hash does not remount React, so an unknown hash arriving from an edited address bar, a stale link, or back/forward would set state correctly but leave the address bar claiming a state the app was not in. One handler now owns the URL for load, popstate, and hashchange alike. It also canonicalises case, so `#MICROSCOPE` becomes `#microscope`.
- Verified in the browser rather than asserted: all five states reachable by deep link, all four non-bench states carry Back-to-Bench, unknown hashes normalise on both cold load and same-document change, Back-to-Bench returns and clears the hash, and the browser back and forward buttons walk the states correctly.
- Phase discipline is enforced in the DOM, not just visually: the bench renders exactly one interactive control (the microscope). The three Phase 2 objects are non-interactive elements, so they cannot be tabbed to or clicked into a view that does not exist.
- Focus moves to the new scene heading on transition. With no router nothing otherwise announces a navigation, which would leave a keyboard or screen reader user stranded while the page changed under them. It is suppressed on first paint so a fresh load does not have focus stolen.
- Audits clean: no hex or raw px in any component, no hex outside `tokens.css`, no undeclared files against the `CLAUDE.md` Section 2 tree, and a sweep of every element in both bench and object states found no dark surface.
- **Known cosmetic issue, deferred:** the fixed-position Back-to-Bench control sits close enough to the placeholder scene heading to crowd it. The real layout arrives with the bench render in Stage D, so polishing the placeholder now would be wasted work.

### 2026-08-31 (Stage B)

- Built the token layer: `styles/tokens.css`, `base.css`, and `console.css`, wired in `main.tsx` in the fixed, load-bearing order.
- **Amended `DESIGN.md` before writing any CSS.** Writing the file exposed that the design system could not fully specify it: Invariant 1.6 requires spacing and type values to come from `tokens.css`, but `DESIGN.md` defined no spacing scale and no type scale, and left `--frost-edge` and the promised shadows valueless. Four amendments recorded as D10 to D13. The design system stays the source of truth; the stylesheet did not quietly become it.
- Committed the font stacks as system stacks (D10), deliberately reversible.
- Resolved the CSS Modules versus global CSS conflict between `PRODUCT.md` Section 6 and `CLAUDE.md` Section 2 in favour of global CSS, since Section 2's load order is binding.
- **Verified in a live browser, not asserted.** All 15 ink-on-ground pairs were measured from rendered pixels via `getComputedStyle`, and every tier clears its floor: `--ink-0` 12.62 to 14.19, `--ink-1` 7.32 to 8.24, `--ink-2` 4.70 to 5.29, `--accent-deep` 5.66 to 6.37. Measured values match the derivation exactly. A sweep of every element confirmed no dark surface anywhere (Invariant 1.1).
- The focus ring was verified by pressing Tab, not by reading the CSS. Two earlier readings were discarded as meaningless: `getComputedStyle` on an unfocused button returns the default outline, and a programmatic `.focus()` does not trigger `:focus-visible`. Under real keyboard focus the ring resolves to `rgb(27, 151, 127)`, exactly `--accent`, at 3px with a 2px offset.
- Audited Invariant 1.6 mechanically: no raw hex outside `tokens.css`, no hex or raw px in any component, no emoji in chrome.
- This satisfies the `CLAUDE.md` Section 3 requirement for a live-browser check on any change to `tokens.css` or a console surface. The KNOWN GAP itself is unchanged: the check was manual, and `tools/audit.mjs` still does not exist.
- `App.tsx` currently renders a temporary token-proof surface so the above could be measured. It is labelled as temporary and Stage C deletes it.

### 2026-08-31 (Stage A)

- Scaffolded the toolchain: React 19.2 + Vite 8.2 + TypeScript 5.9, with GSAP 3.15. No UI, no tokens, no state machine. `App.tsx` renders a labelled placeholder on purpose.
- The four `npm` scripts now exist exactly as `CLAUDE.md` Section 3 specifies, and `build` runs `typecheck` first.
- **Verified the gate rather than assuming it.** With a deliberate type error introduced, `npm run typecheck` exits 2 and `npm run build` exits 2 without ever reaching Vite, so typecheck genuinely blocks the build. Reverting returns both to exit 0.
- **Verified the GSAP plugins named in D4.** `Draggable` and `InertiaPlugin` both resolve from the public `gsap` package with type definitions, and register cleanly. Worth recording because both were historically Club GreenSock only, which would have made D4 unbuildable on the free tier.
- Declared `<meta name="color-scheme" content="light">` in `index.html`. Without it a visitor whose OS is in dark mode gets the browser's dark UA defaults before any of our CSS loads, which is a dark surface and therefore a defect under Invariant 1.1. The explicit ground still arrives with `base.css` in Stage B.
- Set Vite's dev and preview port from `PORT`. Vite does not read it on its own, so tooling that assigns a port was being silently ignored and the server landed elsewhere.
- Pinned TypeScript to 5.9 rather than the current 7.0. TypeScript 7 is the new native compiler and this project's build gate depends on `tsc` being dependable, so that move is worth making deliberately later, not by default now.
- The `CLAUDE.md` Section 3 KNOWN GAP is unchanged: there is still no automated visual or contrast audit, and typecheck is not a substitute for one.

### 2026-08-31 (later)

- Cleared the two blockers standing in front of Phase 1. No application code yet; the status table above is unchanged and still correct.
- **Runtime.** Node was not installed on the development machine, so the mandatory `npm run typecheck` gate could not run at all. Installed Node v26.8.1 / npm 11.19.0. Recorded as D8 in `CLAUDE.md` Section 7, which also closes the package-manager gap left open by D4.
- **Palette.** Committed the accent hue (cold mint, hue 168) and derived the full ink and accent hex values against the contrast floors in `DESIGN.md` Section 2.2, verified against all three grounds rather than chosen by eye. Values and measured ratios now recorded in `DESIGN.md` Sections 2.2 and 2.3, decision recorded as D9. These are flat-swatch numbers and do not discharge the requirement to re-verify against the blurred-bench composite once that render exists.
- Fixed structural drift in the `CLAUDE.md` Section 2 tree, which did not list `.claude/agents/` or `.gitignore`.
- Added the original idea doc to the repo as `IDEA.md` (renamed from `3D personal profolio idea.md`, correcting the filename typo), with its text preserved verbatim under an archival header that maps each of its six contradictions to the governing decision that resolved it. It is history, not a spec.
- **Corrected a false claim in `PRODUCT.md` Section 10.** That section stated the PDAC/Schwann-cell abstract was available in the owner's idea doc. It is not: `IDEA.md` is a design and UX plan and contains no portfolio content at all. The research content is still not in this repo.
- Added `.gitignore`, which the `CLAUDE.md` Section 2 tree listed but which did not exist.
- Still blocked on the owner: the research content itself (abstract, publication list, patent numbers) has no source in this repo, so `content/research.ts` cannot be populated with anything verified. The type-family tokens (`--font-sans`, `--font-mono`) are also still unset.

### 2026-08-31

- Authored the founding docs: `PRODUCT.md` (spec and phase plan), `DESIGN.md` (visual law and tokens), `CLAUDE.md` (invariants and decision record), `AGENTS.md` (roster), and this README.
- Locked the founding decisions via a grilling session (see `CLAUDE.md` Section 7): personal-playground purpose, pre-baked stylized assets, high-key palette law, React + Vite + TS + GSAP, owner-built Spline scene with placeholder-first building, crossfade-plus-scale transitions, and a microscope-first Phase 1.
- Code not yet scaffolded. Next: scaffold the project and build the Phase 1 slice.
