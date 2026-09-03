# Bench Portfolio

**An interactive 3D lab bench as a personal portfolio.** A stylized, high-key lab scene where four objects are alive: click the **microscope** to zoom into research, the **notebook** for publications and patents, the **calendar** for an interactive timeline, and the **computer** for AI projects. It is built to be explored, not skimmed. A traditional resume carries the fast-read load; this is the playground.

> This README is **live**. It is updated as development proceeds. The status table and build log below are the current truth of what is built, in progress, or planned. If a section here claims more than the repo can back up, that is a bug (see `CLAUDE.md` Invariant 1.9).

---

## Status

**Current phase: Phase 1 (vertical slice), in progress. Stages A (toolchain), B (token layer), and C (state machine) are done; scenes and art are next.**
**Last updated: 2026-08-31.**

Status vocabulary: **Planned** (designed, not built) · **In progress** (being built now) · **Implemented** (built and works) · **Live** (deployed and reachable) · **Placeholder** (stand-in art or data, not final).

| Component | Status |
|---|---|
| Product spec, design system, engineering contract, agent roster | **Implemented** (this repo's `.md` files) |
| Project scaffold (React + Vite + TypeScript, GSAP) | **Implemented** (toolchain only, no UI) |
| Design tokens (`styles/tokens.css`) | **Implemented** (verified in-browser) |
| Bench scene: real-time 3D scene + object selection | **Implemented** (placeholder primitive geometry, awaiting the owner's models) |
| Hover-glow on objects | **Planned** |
| State machine + `#hash` deep links + Back-to-Bench | **Implemented** (verified in-browser); onboarding hint still **Planned** |
| Camera transitions (GSAP), reduced-motion path | **Implemented** (verified in-browser) |
| Microscope console (viewfinder, specimen cards, HUD crosshairs) | **Planned** |
| Research content (`content/research.ts`) | **Implemented** (3 items, real PDAC abstract, citation verified against Crossref) |
| Phase 2 content (`publications`, `patents`, `timeline`, `aiProjects`) | **Implemented** (data only; the views they feed are still **Planned**) |
| Owner's 3D models (`assets/models/*.glb`) | **Placeholder** (`microscope.glb` is an exploratory low-poly draft, wired and rendering); notebook, calendar, computer still **Planned** |
| Notebook / Calendar / Computer objects | **Planned** (Phase 2) |
| Deployment to Vercel | **Planned** |
| Mobile pass, sound, focus-knob, metric bars | **Planned** (later polish) |
| Render constraints (`DESIGN.md` Section 10) | **Implemented** (documented, blocking) |
| Automated design audit (`tools/audit.mjs`) | **Implemented** (static half); composite check still **Planned** |

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
3. **Phase 1 wires only the microscope.** The other three objects are intentionally inert (glow plus a "coming soon" plaque) until Phase 2.
4. **Desktop-only for now.** Mobile is a planned reduction, not a Phase 1 deliverable.
5. **Some decisions can only be settled by looking** (does the fake zoom convince, is the focus-knob worth building). Those are tracked as open questions in `CLAUDE.md` Section 7 and are deliberately not pre-decided.

---

## Build log

Newest first. Add a dated entry at the end of every phase or meaningful change, and update the status table above to match. This is the "live" part of the README.

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
