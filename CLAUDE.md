# Bench Portfolio: System Invariants and Developer Guide

This document is a contract, not a description. If the code and this file disagree, one of them is a bug: decide which, then fix that one. The invariants below are binding. Each names an enforcer agent (see `AGENTS.md`); the ones marked blocking cannot be overridden without a written waiver recorded in Section 7 with a date and a reason.

Read `PRODUCT.md` for what the project is and why. Read `DESIGN.md` for the visual law. This file is how the code holds itself to both.

---

## 1. Non-negotiable invariants

### 1.1 High-key only

Enforcer: brand-designer (blocking). There is no dark mode anywhere. No background, console, modal, or overlay may go dark, regardless of which reference inspired it. **Amended by D27 (2026-09-04): the bench WORKTOP is a recorded exception, scoped to that one object surface and measured; see DESIGN.md 10.7. Every DOM surface, and every other surface in the render, still obeys this rule absolutely.** Contrast is near-black ink on luminous white; "glow" is brighter and whiter with a cold rim, never neon on black. A dark surface is a defect. See `DESIGN.md` Section 1 and Section 7.

### 1.2 One real-time scene, with baking retained as a fallback

Enforcer: scene-artist + architect. **Amended 2026-09-03 (D20); the original pre-baked-stills form of this invariant is superseded.**

The bench is a single real-time 3D scene (Three.js via React Three Fiber), containing all four objects, with one camera state per bench state. Transitions are camera moves, not 2D fakes. There is exactly one scene and one lighting rig, so the master view and every object view are consistent by construction rather than by verification.

Two limits keep this from becoming an open licence:

- **Still not photorealism.** D2 retired that goal and it stays retired. The look is stylised, high-key, and matte, which is deliberately the cheapest thing to render well in real time.
- **Baking stays a live fallback, not a deleted path.** Stills can be captured from this same scene at any time and fed to the 2D crossfade. Open question 1 (does the zoom convince) is now answerable by looking at the real thing, and if the answer is bad, the fallback costs a capture rather than a rebuild. Do not delete the fallback from the docs without a recorded decision.

### 1.3 Placeholder-swap discipline

Enforcer: frontend-engineer. **Amended 2026-09-03 (D20): the contract now covers models, not images.**

The interaction layer is built against primitive placeholder geometry defined in code, so nothing waits on the owner's models. When a real model arrives it drops into `src/assets/models/` under the filename the scene already expects, and swapping it in is a one-line change from a primitive to a loaded mesh. The object's transform, its camera state, and its hotspot do not move.

Filenames are therefore an interface: `bench.glb`, `microscope.glb`, `notebook.glb`, `calendar.glb`, `computer.glb`. Never versioned in the filename, always overwritten in place. **Only export-ready optimised `.glb` is committed**; source files (`.blend` and equivalents) stay out of this public repository entirely, because every revision of a large binary is permanent in git history. Placeholder geometry that ships to production without being flagged in the README status table is a defect.

### 1.4 Single-page state machine, no router

Enforcer: frontend-engineer. Navigation is one finite state machine (`state/benchMachine.ts`) with states `BENCH`, `MICROSCOPE`, `NOTEBOOK`, `CALENDAR`, `COMPUTER`. No server router. Deep links are optional `#hash` only, synced to state on load and on transition. A persistent Back-to-Bench control exists in every non-`BENCH` state. No state may be unreachable or unexitable.

### 1.5 Content lives in typed data files

Enforcer: content-steward (blocking on claim accuracy). All user-visible portfolio content (research, publications, patents, timeline, AI projects) lives in `src/content/*.ts` behind the typed interfaces defined there, never hardcoded inside components. A component renders content, it does not contain it. Every factual claim (a patent number, a publication venue, a date) must be accurate as stated by the owner.

### 1.6 Tokens only

Enforcer: brand-designer. Every color, radius, spacing, duration, and type value comes from `styles/tokens.css`. A raw hex or px value in a component is a defect. Contrast is verified in a live browser against the actual composite (the blurred bench), not a flat swatch.

**Extended 2026-09-03 (D20) to cover the 3D scene.** Materials and lights are set in JavaScript, where nothing stops a colour drifting off-palette, so the scene does not hardcode colours either: `three/palette.ts` reads the CSS custom properties at runtime and is the only place the scene gets colour from. A literal colour in a material is the same defect as a raw hex in a component.

### 1.7 Phase discipline

Enforcer: product-strategist. Phase 1 wires only the microscope. The other three objects glow on hover and show a "coming soon" plaque; they are not wired to a view until their phase. Building Phase 2 objects before Phase 1 is shipped and live is a violation, because the feel questions Phase 1 answers (does the fake zoom convince, does the viewfinder work) must be settled by looking before the pattern is replicated.

**Amended 2026-09-04 (D28), by owner override, with the invariant knowingly unsatisfied.** The NOTEBOOK arrival transition (the opening flip) is built and its hotspot navigates, while Phase 1 was **not** shipped and live: hover-glow, the onboarding hint, and the Vercel deploy were all outstanding. product-strategist ruled this a violation and was overridden in chat. The scope is narrow and the rest of this invariant still binds: **CALENDAR and COMPUTER remain Phase 2, unwired and inert**, and the notebook has an arrival but still **no content view** - `#notebook` renders the coming-soon plaque, not a publications console. See D28.

### 1.8 Motion respects the user

Enforcer: motion-engineer. `prefers-reduced-motion` cuts straight to the destination still with no zoom or blur animation. Transitions use fast-in, slow-out easing only, no overshoot. Durations come from the motion tokens.

### 1.9 Honest status

Enforcer: product-strategist (blocking on outward claims). The `README.md` status table and build log must match reality. A component may be described as Implemented only when it is built and works; placeholder art, stubbed objects, and planned work are labeled as such using the status vocabulary in `README.md`. An outward-facing claim that outruns what the repo can back up is blocked.

---

## 2. Project structure

Declarative. Files not listed here do not exist yet; adding an unlisted file without updating this tree is structural drift.

```
Bench-portfolio/
  .gitignore
  .claude/
    agents/                      the eight specialist agent definitions
    launch.json                  dev-server config for the preview tooling
  index.html
  package.json
  package-lock.json
  vite.config.ts
  tsconfig.json
  IDEA.md                        the original idea doc, archival and superseded
  PRODUCT.md                     what it is, why, and the phase plan
  DESIGN.md                      the visual law and token system
  CLAUDE.md                      this contract
  AGENTS.md                      the specialist-review roster
  README.md                      live status, quickstart, build log
  src/
    main.tsx
    App.tsx                      mounts the state machine
    state/
      benchMachine.ts            BENCH + four object states, hash sync
    scenes/
      Bench.tsx                  master still + hotspots + onboarding
      Microscope.tsx             Phase 1 console (viewfinder, cards, HUD)
      Notebook.tsx               Phase 2
      Calendar.tsx               Phase 2
      Computer.tsx               Phase 2
    components/
      Hotspot.tsx
      BackToBench.tsx
      OnboardingHint.tsx
      ViewfinderMask.tsx
      SpecimenCard.tsx
      HudCrosshairs.tsx
    content/
      research.ts                Microscope data (Phase 1)
      publications.ts            Notebook data (Phase 2)
      patents.ts                 Notebook data (Phase 2)
      timeline.ts                Calendar data (Phase 2)
      aiProjects.ts              Computer data (Phase 2)
    three/
      BenchScene.tsx             the R3F scene: lights, objects, materials
      CameraRig.tsx              camera state per bench state, GSAP moves
      Model.tsx                  .glb loader, token material mapping, seating
      palette.ts                 token bridge, reads tokens.css into the scene
      motion.ts                  EASE + the eyepiece-dive keyframes (D25)
    assets/
      models/                    export-ready .glb only; filenames are the 1.3 contract
      renders/                   baked stills, only if the 1.2 fallback is taken
    styles/
      tokens.css                 all design tokens (loads first)
      base.css                   reset + ground
      console.css                frosted consoles and cards
  tools/
    audit.mjs                    static token + source audit (npm run audit)
    composite-audit.js           browser-only composite contrast check
  wip/                           scratch, never imported by src/ or shipped
    README.md                    what is parked here and the promotion bar
    models/                      exploratory 3D artefacts, not candidate assets
  wip/                           scratch artefacts, never imported by src/
    README.md                    what is in here and why it is not an asset
    models/                      exploratory .glb, not candidates under 1.3
  public/
```

Styling load order is fixed and load-bearing: `tokens.css` before `base.css` before `console.css`. Tokens must exist before anything references them.

---

## 3. Development workflow

```bash
npm install
npm run dev         # local dev server (Vite)
npm run typecheck   # real gate: catches broken imports and prop drift
npm run audit       # design-system gate: token contrast, high-key law, tokens-only
npm run build       # production build, runs typecheck first
npm run preview     # serve the production build locally
```

Typecheck is the mandatory gate. The production build runs it first and fails on any type error.

**KNOWN GAP, now narrowed but NOT closed.** `tools/audit.mjs` exists and runs as `npm run audit`. It mechanically enforces the token contrast floors against every ground, the high-key law on every ground, the tokens-only rule in components, the fixed stylesheet load order, and structural drift against the Section 2 tree. It exits non-zero on failure, so it is a real gate.

What it still cannot do is the half that matters most once art exists: **the composite check**. Text sits on a translucent console over a *blurred* baked still, and `backdrop-filter` has no static equivalent, so the effective backdrop under a line of text can only be measured in a live browser against a real render. That check lives in `tools/composite-audit.js` and is pasted into the dev console by hand. It is written to report the **worst** pixel under each text element rather than the mean, because the mean is exactly what lets a bad render pass.

So: `npm run audit` is mandatory alongside typecheck, and until the composite half is automated against a real render, **any change to `tokens.css` or to a console surface still requires a manual browser check noted in the PR**. Do not change a ground or ink token without confirming every text tier still meets its floor (`DESIGN.md` Sections 2, 3, and 10).

---

## 4. Content model

Content is data, not markup. Each `src/content/*.ts` file exports a typed array behind the interface declared at the top of `PRODUCT.md` Section 10. To update the portfolio later, edit a data file, not a component. Phase 1 populates `research.ts` (the PDAC/Schwann-cell work plus the owner's other research items). The Phase 2 content files were filled early, on the owner's instruction, once a single source made all of them available at once (D18). Filling a data file is not building a Phase 2 object, so Invariant 1.7 is untouched: no Phase 2 hotspot navigates and no Phase 2 view exists. A component that renders content must degrade gracefully on an empty array (render nothing, not a broken layout).

---

## 5. Styling ownership

Design polarity is LIGHT, by law, not preference (`DESIGN.md` Section 1). The reasoning is inherited from the theme: the experience is a luminous specimen-under-glass lab, and contrast comes from ink on white. Tokens are defined only in `styles/tokens.css`. The three material rules that carry the look: never stack one frosted surface on another; every frosted surface has a bright cold edge; the accent has two tiers (graphical `--accent`, text-safe `--accent-deep`). Nothing in this project sits over video, so there is no dark material.

---

## 6. Deployment

Static Vite build deployed to Vercel, auto-building from `Bench-portfolio` on push to the main branch (free tier, Vercel subdomain to start). A custom domain is an optional later step (add DNS records when a domain is chosen). No server, no backend, no secrets in the client.

---

## 7. Decision record

The only valid way to change an invariant is to record the decision here, dated, with a reason.

### 2026-08-31: Founding decisions (grilling session)

The project scope was pressure-tested with the grill-me skill before any code. The binding outcomes:

- **D1. Purpose.** A personal playground built to the owner's taste. The resume carries the recruiter load, so the experience does not optimize for fast skimmers and needs no "skip to substance" path.
- **D2. Fidelity.** Not photorealistic real-time 3D. Pre-baked stylized stills plus 2D faked transitions (Invariant 1.2). The word "photorealistic" is retired from the goal.
- **D3. Palette.** High-key only, no dark mode, resolving the contradiction in the idea doc (`IDEA.md`, Invariant 1.1). All "midnight/command-center" references reinterpret to luminous white consoles.
- **D4. Stack.** React + Vite + TypeScript, with GSAP (plus Draggable and InertiaPlugin) as the motion layer, chosen over Framer Motion because the design leans on timeline choreography and scrub interactions (the focus-knob, the calendar scrub).
- **D5. Assets.** The owner builds the Spline scene and exports the stills; the interaction layer is built against matching-filename placeholders in the meantime (Invariant 1.3).
- **D6. Transitions.** Crossfade plus scale is the Phase 1 default (easiest to implement); a pre-rendered clip for the hero microscope move is a later, optional upgrade only if the 2D zoom feels flat when viewed live.
- **D7. Scope.** Phase 1 is the full bench render plus the microscope wired end to end plus deployed live; the other three objects glow and show "coming soon" (Invariant 1.7). Mobile and sound are out of Phase 1.

### 2026-08-31: Phase 1 unblocking decisions

Two blockers were resolved before any code was scaffolded, because both would have caused rework across the whole surface if guessed at.

- **D8. Runtime.** Node (installed 2026-08-31 via Homebrew; v26.8.1 / npm 11.19.0) is the committed runtime and npm is the committed package manager, closing the gap left by D4. The machine previously had only bun, which meant the mandatory `npm run typecheck` gate in Section 3 could not run at all. npm keeps `README.md`, Section 3 here, and `PRODUCT.md` Section 6 true as written and matches Vercel's default zero-config build. bun remains fine for ad-hoc local use; it is not the documented contract. **Open:** confirm Vercel's supported Node version at first deploy and pin it, since v26 is newer than the typical hosted default.
- **D9. Palette values.** The accent hue is **cold mint** (hue 168), per the default recommended in `DESIGN.md` Section 2.3. The full ink and accent hex values were derived by binary-searching lightness to the contrast floors in `DESIGN.md` Section 2.2 rather than chosen by eye, and each is verified against all three grounds with the darkest ground (`--ground-1`) as the worst case. Values and measured ratios are now recorded in `DESIGN.md` Sections 2.2 and 2.3. These are flat-swatch measurements and do not discharge the Section 3 requirement to re-verify against the blurred-bench composite once that render exists.

### 2026-08-31: Stage B, design-system amendments

Writing `tokens.css` exposed that `DESIGN.md` could not fully specify it. Invariant 1.6 requires that every colour, radius, spacing, duration, and type value come from `tokens.css`, and `PRODUCT.md` Section 7 says the file holds "palette, spacing, type scale", but `DESIGN.md` defined **neither a spacing scale nor a type scale**, and left `--frost-edge` and the promised shadows without values. Four amendments were made to `DESIGN.md` first, then implemented from it, so the design system stays the source of truth rather than the stylesheet becoming it.

- **D10. Type.** The two font tokens are committed as **system stacks**, with the mono ordered to prefer instrument-grade faces already installed (`SF Mono`, `Cascadia Mono`) before falling back. No network request, no layout shift, which serves the "keep the bundle light" constraint in `PRODUCT.md` Section 6. Deliberately reversible: swapping in a webfont is a one-line change to one token. A seven-step type scale on a roughly 1.25 ratio, plus line-heights, weights, and tracking, is recorded in `DESIGN.md` Section 2.6.
- **D11. Spacing.** A 4px base grid, eight steps, recorded in the new `DESIGN.md` Section 2.8. Chosen so the existing 8/18/24/32 radius tiers land cleanly against padding.
- **D12. Materials.** `--frost-edge` becomes two strokes (bright inset rim plus a cool outer hairline derived from `--ink-3`, so the edge cannot drift off-palette), and the shadows that Section 2.4 prose already promised now exist as three tokens derived from `--ink-0` at low alpha. Never pure black: black shadows on a cool near-white ground read muddy and warm the palette, which Section 2.1 prohibits.
- **D13. Motion, and one documented exception to Invariant 1.6.** GSAP ease names such as `power3.out` are strings, not valid CSS, so they cannot live in `tokens.css`. Durations stay in `tokens.css`; the ease strings live as one exported constant, which since D20 was `EASE` in `three/CameraRig.tsx` rather than the never-built `Transition.tsx`, until a second consumer existed. **That second consumer arrived with D25**: the DOM-side whiteout/console cross-dissolve in `App.tsx` also needed the same curves, so `EASE` (and the eyepiece-dive's measured keyframes) moved to a dedicated `three/motion.ts`, exactly the module this entry originally deferred. CSS easing tokens mirroring the GSAP curves were added so a CSS hover and a GSAP timeline ease identically.

**Styling approach.** Plain global CSS with the three declared stylesheets, not CSS Modules, resolving the conflict between `PRODUCT.md` Section 6 ("CSS Modules or a lightweight styling approach") and this file's Section 2, whose fixed load order is described as load-bearing. Section 2 wins because it is the binding declarative tree.

### 2026-08-31: Stage C, arbitration between Invariants 1.4 and 1.7

- **D14. Reachability versus wiring.** Invariant 1.4 names all five states and says none may be unreachable or unexitable. Invariant 1.7 says the three Phase 2 objects are "not wired to a view" until their phase. Taken literally together they conflict: a state nothing can enter is unreachable. Resolved by separating two senses of "reachable". **All five states are reachable by `#hash` and every one is exitable**, so 1.4 holds and no dead state hides in the type. What Phase 1 withholds is the wiring **from the bench**: a Phase 2 hotspot does not navigate, and a Phase 2 state renders the "coming soon" plaque rather than a content view. That is 1.7 as written, not a workaround. Phase membership is encoded once, in `OBJECT_PHASE` in `benchMachine.ts`, so promoting an object in Phase 2 is a one-line change rather than a hunt through scene files.

### 2026-09-03: Render constraints and the partial audit

- **D15. The render is governed, not assumed.** `DESIGN.md` Sections 1 through 9 govern the interface and silently assumed the imagery underneath it. That assumption does not survive contact with the material: the framed still is not a picture, it is the backdrop a translucent console has to stay legible against, and Section 2.5 forbids every CSS remedy for a bad backdrop. New `DESIGN.md` **Section 10** now carries the luminance law (a hard floor of 203 under a console, 215 to 245 target), the quiet-zone rule, the light and glow constraints, and the sRGB export requirement. Derived from the committed token values rather than estimated. Blocking, enforced by brand-designer.
- **D16. Three render rulings, arbitrated.** scene-artist and brand-designer disagreed while specifying the Spline work. Resolved in brand-designer's favour, who holds blocking authority on the palette law: **bloom off** (it produces exactly the coloured halo Section 1 prohibits), **no mint anywhere in the render** (putting the accent in the scenery retires its meaning as "interactive", which Section 2.3 forbids), and **broad object surfaces peak at 235** (the hover glow is a CSS state, so a near-white object leaves it no headroom and the hotspot feels dead). **Amended by D22 (2026-09-03): the figure is raised to 245.**
- **D17. The audit gap is narrowed, not closed.** `tools/audit.mjs` automates every check that can be made statically and is now a mandatory gate. The composite check cannot be static, because `backdrop-filter` has no static equivalent and no render exists yet, so it stays a documented manual step in `tools/composite-audit.js`. Section 3 says so explicitly rather than claiming a closed gap, per Invariant 1.9.

### 2026-09-03: Content, and two shape amendments

- **D18. Phase 2 content data, filled early and deliberately.** `CLAUDE.md` Section 4 said the Phase 2 content files are "filled in their phases", and that was the right default while content had no source. It stopped being right the moment one document (the owner's resume, plus a DOI) made all four files fully available at once. The owner instructed the fill. This does **not** touch Invariant 1.7, whose stated reason is that the feel questions Phase 1 answers must be settled by looking before the view pattern is replicated: a typed data file carries no view, wires no hotspot, and answers no feel question. What 1.7 forbids, building the Phase 2 objects, remains unbuilt. Section 4 above is amended to say so rather than left contradicting the repo.
- **D19. Three optional fields added to the `PRODUCT.md` Section 10 shapes.** The declared shapes could not express real information that exists: a `Publication` had nowhere to record what the owner actually did on a paper, a `Patent` could record neither where it was granted nor what it does (which is most of what makes a patent worth showing), and a `TimelineEntry` could not distinguish a point-in-time award from a spanning role. Added `Publication.contribution`, `Patent.jurisdictions` and `Patent.summary`, and `TimelineEntry.kind`. All **optional**, so the declared shapes are extended rather than broken, and `PRODUCT.md` Section 10 is updated to match.
- **Awards have no content model.** `PRODUCT.md` Section 10 defines five shapes and none of them is an award, yet the resume carries four. Rather than drop them or add an undeclared sixth file (structural drift under Section 2), they live in `timeline.ts` as entries with `kind: 'award'`, which is defensible because they are dated milestones on a chronology. If a dedicated model is wanted, that is a `PRODUCT.md` change made deliberately.
- **One unsourced value, flagged not hidden.** `timeline.ts` gives the UCSD start as `2025-09`. The resume states only the expected graduation of Jun 2029, so the start is inferred from a standard four-year program. It is marked inline in the file and needs the owner's confirmation before it goes outward (Invariant 1.9).

### 2026-09-03: D20, the bench becomes one real-time scene

- **D20. Real-time 3D, with baking kept as a fallback.** Overturns the pre-baked-stills form of Invariant 1.2 and supersedes the asset half of D2, D5, and D6. The owner is authoring, editing, and iterating the 3D files themselves, and that is what decided it: on the baked path every model tweak costs two re-exports, an overlay registration check, a contrast re-verification, and two multi-megabyte binaries committed to a public repo. That loop is unaffordable while the look is still being found, and it was certain to be still being found, since the scene has never been built. On the real-time path a model revision costs a file drop and a refresh.

  Three further reasons, in descending weight. The entire fake-zoom apparatus (identical camera positions, FOV-only changes, overlay registration, a hand-computed scale factor and transform origin) existed solely to make a 2D crossfade resemble a camera move, and it disappears. One scene and one lighting rig make master-to-object consistency structural rather than something verified per export. On bundle size the argument was weaker than it was made to sound at the time, and the correction belongs here rather than only in the build log: the figure quoted while deciding was "roughly 180kb gzipped", and the measured cost is **323.65kB gzipped total, up from 61kB, so about 263kB added**. Two 3200x1800 PNGs are still plausibly larger, but this was presented as a point in favour and it is at best neutral. Code-splitting the canvas is an open follow-up.

  **What did not change.** D2's retirement of photorealism stands: the look is stylised, high-key, matte, which is deliberately the easiest case to render well in real time. The baked path is retained as a documented fallback rather than deleted, because Open question 1 is exactly the kind of thing that must be settled by looking, and this way a bad answer costs a still capture instead of a rebuild.

  **Cost of the switch, measured not estimated.** Zero lines of `src/` touched art at the time of the decision, verified by grep. Stages A, B, and C survive intact. This was the cheapest moment the switch would ever cost, and it will not be this cheap again.

- **D21. Two conditions attached to D20.** First, a **token bridge**: materials and lights are set in JavaScript where nothing enforces the palette, so `three/palette.ts` reads the CSS custom properties at runtime and is the scene's only source of colour. Without it Invariant 1.6 silently stops governing half the screen. Second, **only export-ready `.glb` is committed**; source files stay out of this public repository, because every revision of a large binary is permanent in git history and the owner will be revising often.

- **`@react-three/drei` deliberately not installed.** Primitive placeholder geometry does not need it, and `PRODUCT.md` Section 6 says keep the bundle light. Revisit when model loading actually needs `useGLTF`; `useLoader` with three's own `GLTFLoader` may be enough.

### 2026-09-03: D22, the broad-surface luminance ceiling raised to 245

- **D22. `DESIGN.md` 10.3's broad-object-surface ceiling moves from 235 to 245, requested by the owner.** D16 set 235 because "the hover glow is a CSS state, so a near-white object leaves it no headroom." That reasoning describes the render pipeline D16 was written for: a baked 2D still with a CSS brightness filter over it. D20 replaced that still with meshes in a WebGL canvas, and **no hover or active-state effect has been built for it yet** — checked by grep across `three/` and `components/` before writing this, zero matches for hover or glow. The headroom argument still holds in principle; a state change needs somewhere to go, whatever ends up implementing it. What no longer holds is treating 235 as a measured number, because it was measured against a mechanism (a CSS filter over a flat image) that the current architecture does not have.

  245 is not a new figure chosen to fit a specific need: it is the top of the `DESIGN.md` 10.1 composite target range, already meaningful elsewhere in this document. Reusing it means the change touches only 10.3's two dependent bullets (the broad-surface ceiling itself, and the baked-glow ramp's floor, moved to match so the two bright tiers keep the same 10-point width relationship they had at 235) rather than requiring new luminance math anywhere else.

  **This is provisional in one respect the record should not hide.** No hover or active-state effect exists in code to measure against this number, for either the microscope model or the coming-soon glow on the three unwired objects (Invariant 1.7). When one is built, it should be measured against 245 the way the original 235 was measured against `ms_shell` (`wip/README.md` records that measurement), and this figure revisited if 10 points of headroom is not enough or is more than needed. brand-designer's blocking authority over the palette law (Invariant 1.1) is unchanged by this entry; the owner directed the specific change in chat, which is why it is recorded as a decision rather than an inline edit.

### 2026-09-03: D23, the microscope console (Phase 1's actual payload)

Planned by two specialist reviews before any code, per `AGENTS.md`'s stated pipeline: ux-designer for the information architecture, brand-designer for the legibility gate. Both are recorded here because they produced binding constraints, not just advice.

- **The viewfinder is two tiers, not one mask.** A clear core with no frost at all, so the live scene shows through crisp and undimmed ("looking through glass, not gauze"), and an outer `--frost-1` ring carrying the HUD chrome. Cards float on the clear core, which is legal under Section 2.5 because a live canvas is not a frost layer, so nothing is stacked on nothing.
- **Selection is an inline disclosure, not a modal.** A modal would duplicate the escape-hatch problem BackToBench already solves once, and would force its own opaque panel under Section 2.5's stacking rule. `aria-expanded`/`aria-controls` make the relationship explicit to assistive tech. `Escape` collapses an expanded card back to the arc; it does **not** exit to the bench, so BackToBench remains the sole route out (Invariant 1.4) and no state is exitable by a keypress that is not also visibly, persistently offered.
- **HUD crosshairs are static and never react to which card is focused.** DESIGN.md 4.6 calls them "pure flavor," and a crosshair that changed on selection would imply it reports something real, which this system has no data to back.

**D24. The quiet-zone rectangle in DESIGN.md 10.2 does not hold for this framing, measured directly rather than assumed, and the fix had to be in the camera, not CSS.** Sampling the generic 76%x68% rectangle at the live `MICROSCOPE` camera state (after painting the actual page ground behind the canvas's transparent pixels, and applying the real 20px blur) gave a range of 119 to 202 levels depending on framing, against a ≤12 limit, with `min` repeatedly landing near 46 to 130 against a 203 floor. Root cause: `ms_stage`, mapped to `--ink-1` (a text-tier token, raw luminance ~78), sits on a broad-ish plate directly in the frame the original camera state aimed at. No amount of small reframing fixes an order-of-magnitude gap like that while any of that surface remains inside a full-rectangle quiet zone; either the geometry moves entirely outside the console's footprint or the material changes, and changing the owner's authored material choice unilaterally was not this decision's to make. The camera was retargeted from the stage/illumination cluster (`target.y` 0.72) to the arm and binocular head, framing that is both cleaner (confirmed: a correctly-sized circular region there measures mean 226, min 220, range 11, clearing every 10.1/10.2 floor) and thematically apt, since this model was rebuilt specifically for a future eyepiece-zoom transition the head framing sets up. **This confirms DESIGN.md 4.4's circular mask is not optional styling: the rectangle genuinely fails where the circle genuinely passes**, which is exactly what the brand-designer review predicted before any measurement was taken.

- **A real bug, found by testing the actual DOM, not the design.** Node-level translations read directly from the `.glb`'s glTF JSON are in **model space**, before `Model.tsx`'s own normalisation (scale-to-`targetHeight`, reseat base at y=0). Using those raw values to aim a world-space camera target put the aim point roughly 2.5x too high, framing empty air. The fix is definitional, not numeric: derive camera targets from the object's known world-space height (`OBJECT_HEIGHT` in `BenchScene.tsx`), never from a model's raw export coordinates.
- **A second real bug, CSS specificity, not logic.** `.specimen`'s width rule lost to the earlier `button.card { width: 100% }` rule (defined for the bench page's own buttons), because element+class specificity beats a bare class selector regardless of source order in the file. Every card rendered full-width and stacked vertically. Fixed by scoping to `.specimens .specimen`, which raises the class count past the competing rule rather than fighting it with `!important`.
- **`tools/composite-audit.js` adapted for the live canvas** (brand-designer's gate, item 4): samples `.scene__canvas canvas` directly at 1:1 (no `object-fit: cover` crop math, since the canvas is not object-fit cropped), paints the real page ground behind transparent pixels before blurring (a canvas with `alpha: true` and no scene background reads transparent regions as black otherwise, which is a measurement artifact, not a real dark surface), and documents that a temporary `preserveDrawingBuffer` flag plus a post-settle wait is required before pasting it in, since the live buffer can be blank or stale outside the same tick as a paint.
- **Two items deliberately not done in this pass, flagged rather than silently skipped.** `frameloop="demand"` (R3F runs a continuous render loop even when the camera is at rest, which is a real but separate performance question from the correctness work here) and a Safari-specific `backdrop-filter`-over-`<canvas>` check (documented as a requirement in the adapted audit script, not yet run).

### 2026-09-03: D25, the eyepiece dive, a real camera move ending in a deliberate whiteout

Requested by the owner: the MICROSCOPE arrival should fly through one ocular and end fully white, the console appearing there, with no bench visible at all. Planned by motion-engineer (the camera choreography) and brand-designer (the palette legality of a full-white terminal frame) before any code, the same pipeline D23 used.

- **Committed to the left ocular (`Eyepoint_L`), never centred.** The model's own geometry rules out a centred push: the two bores diverge from the prism housing with no shared point a camera can look squarely down (confirmed in the git history of the binocular-head rebuild, and by reading the `.glb`'s own node transforms). The choice between L and R is otherwise arbitrary; L was picked for the shorter lateral travel from the existing MICROSCOPE resting position.
- **A three-leg GSAP timeline, not one tween, and not a straight chord to the terminal point.** Leg 1 reuses the existing bench-to-head move verbatim (D24's framing gets a real beat, not a skip). Leg 2 re-aligns onto the ocular's own axis (`Eyepoint_L`, aimed at `Eye_Lens_L`) before committing, because a straight chord from the original external position to a point deep inside the eyecup is not generically coaxial with the tube and risks visibly clipping through the eyecup rim mid-flight. Leg 3 is the short, committed push through the disc. Keyframes are measured, not estimated: read from the live scene via a temporary probe on `Model.tsx`'s group ref (`getObjectByName` + `getWorldPosition`), not from the `.glb`'s raw node translations, which are in pre-normalisation model space and would have put the aim point roughly 2.5x too high (the same class of bug D24 already found once).
- **`camera.near` lowered from the R3F default (0.1) to 0.01.** The dive ends about 0.05 world units from the disc it looks at, closer than the default near plane, which would have clipped the terminal geometry away at exactly the moment it is meant to fill frame. Safe at this scene's scale (tens of units).
- **The whiteout is a real `--ground-2` DOM overlay, not left to render precision alone.** brand-designer ruled a full-frame flat white as a genuinely new case DESIGN.md 10.1 to 10.3 never anticipated (those sections assume text staying legible over a busy scene, not a moment with deliberately no scene left), legal as either a neutral (non-saturated, so DESIGN.md 10.3's "never emissive saturated" rule does not apply) emissive material or a token-driven overlay, explicitly **not** as a bloom pass (blocked outright, same reasoning as D16). Built both: `ms_eye_glow` gained an `emissive` field on `MaterialSpec`, neutral `--ground-2`, scoped to this one material; and a `--ground-2` overlay cross-dissolves in as the guaranteed floor under it, so the whiteout does not depend on pixel-perfect geometry alignment holding up across viewports or a future re-export. The rule itself, not just this decision's reasoning, is recorded as new **DESIGN.md Section 10.5**, edited directly as the operative spec per the same convention D22 used, so 10.1's "clipped pure white, at most 0.5%" ceiling does not read as silently contradicted by a render this file never anticipated.
- **The whiteout persists for the whole visit, not a momentary flash.** "I would not be able to see the bench at all" is treated as a property of being in the state, not just the instant of arrival: the overlay stays at full opacity until `state` leaves MICROSCOPE.
- **Reduced motion, first paint, and a direct `#microscope` link all land on the existing three-quarter framing, never the dive.** Landing cold on a full whiteout with no context for where you are would be more disorienting than the standard treatment, not less, which is the same reasoning D24's console build already applied to the resting camera state.

**The debugging story here is worth recording in full, because the first fix was wrong and the reasoning for why matters more than the fix itself.**

Initial testing found a real bug: reduced motion and a direct link both showed the full whiteout, which they must never do. The first diagnosis was React 18 StrictMode's development-only double-invoke of an initial mount's effects (mount, run, cleanup, run again): a ref (`isFirst`/`isFirstRender`) mutated inside a `[state]`-keyed effect's own body, with no inverse in cleanup, would see the synthetic second invocation read an already-flipped value and wrongly take the animated path. This diagnosis was **plausible, self-consistent, and wrong**, confirmed wrong by turning StrictMode off entirely and watching the bug persist unchanged. (The fix for that theory, a dedicated empty-deps mount-tracker effect declared after the state-keyed effect that reads it, is real and correct StrictMode hygiene and was kept in both `CameraRig.tsx` and `App.tsx`, but it was not the cause of the observed symptom.)

The actual cause: `useBenchMachine`'s initial state is derived from `location.hash` in a `useState` lazy initializer, which runs synchronously on the first render, but in this development environment `location.hash` is not always readable at that exact synchronous point for a fresh navigation to a URL that already carries a hash. The hook's own mount effect corrects this a tick later once the hash is readable, which means a direct link can genuinely commit `state: 'BENCH'` first and `state: 'MICROSCOPE'` moments after: a real second commit, indistinguishable from a real user transition by "was this the first render" alone. This has been true since Stage C and was invisible before D25, because the only consequence was ever an instant camera snap either way. D25 gave that harmless-until-now timing quirk a loud, visible consequence.

The fix that actually worked is narrower and more precise than "was this a transition": `App.tsx` now tracks `hasUserNavigated`, a ref set **only** inside `handleEnter`, which wraps the state machine's `enter` and is the only path a real click can take. `isUserInitiated` threads through `BenchScene` to `CameraRig` and gates the dive branch specifically, leaving `wasFirst` (and the StrictMode fix that hardened it) untouched for the ordinary instant-vs-tween decision every other state still uses. This is immune to however many automatic corrections the hash sync makes on the way to a stable value, because none of them are a click.

The lesson for whoever debugs a similar "works on click, fails on load" split in this codebase next: check what actually differs about the SEQUENCE of state values on each path before reaching for framework lifecycle explanations. A plausible, well-reasoned diagnosis that fixes nothing is worth abandoning fast, not defending.

### 2026-09-04: D26, runtime-generated object surfaces

- **D26. `DESIGN.md` 10.3's "no baked UI" rule is amended to permit surface markings generated at runtime from tokens, and the rule itself is recorded as new DESIGN.md Section 10.6.** Requested by the owner while specifying the calendar, which cannot read as a calendar without a month grid on it. Section 10.6 is the operative spec, edited directly per the convention D22 and D25 already set; this entry is the reasoning.

  **What actually changed, and what did not.** The load-bearing word in 10.3 is *baked*, and its own text says why: "baking it makes it un-tokenizable". A pattern drawn at runtime from `three/palette.ts` is not baked. `tokens.css` stays the single source of truth, the pattern restyles itself if a token moves, and no image bytes enter the repository (which D21 wants independently). The baked case remains exactly as prohibited as before. What 10.6 permits is narrow: markings that belong to the depicted object as a physical thing. Interface chrome — HUD marks, focus rings, glow rings, plaque type, callouts — stays forbidden **by any means**, because generating it into a texture instead of baking it would evade the letter of 10.3 while defeating its purpose. The line is object-versus-interface, not decorative-versus-functional.

  **The hard limit, and the reason this is not an open licence: accessibility.** Canvas text is invisible to assistive technology, unselectable, unsearchable, and untranslatable. So 10.6 requires that nothing meaningful exists only in the render. The calendar's numerals qualify precisely because they say nothing a user needs — a generic 30-day month, no year, no real date, so they are also not an outward claim under Invariant 1.9. The moment real content has to appear on an object, it must also exist in the DOM where Section 3 governs it. That condition is what keeps this from becoming a route around the DOM.

  **Why the alternative was rejected, measured rather than argued.** Modelling the grid as raised geometry keeps text out of the render entirely and was the original plan, written into the calendar's own build prompt. At the bench camera the calendar stands about 0.7 world units tall, and ribs at any plausible thickness project to roughly 0.6px: in the file, invisible on screen. That is the third time this project has hit the same wall — the laptop keycaps one ink tier from their well, and the notebook's page block at 0.13mm gaps — and the first two were caught only by rendering and looking. A mipmapped texture survives projection at every distance; thin geometry does not.

  **Scope.** Two generated surfaces exist: `ms_page` (quadrille ruling, no glyphs, and legal under 10.3 as it already stood since it draws no text) and `ms_calendar_face` (month grid with numerals, which is the case that needed this decision). A third is a new ruling, recorded, not an appeal to this one. brand-designer's blocking authority over Section 10 is unchanged by this entry; the owner directed the change, which is why it is a decision record rather than an inline edit.

### 2026-09-04: D27, the bench becomes a real lab bench

- **D27. The bench worktop is `--ink-1`, a dark surface, which is an exception to Invariant 1.1 and to DESIGN.md 10.1's 203 floor.** The rule itself is recorded as new **DESIGN.md Section 10.7**, per the convention D22, D25 and D26 set. The owner supplied a reference photograph of a real lab bench and chose the dark top explicitly after being shown what it collides with, so this is a directed decision, not an inference.

  **The cost, measured rather than argued.** On the live `BENCH` render the scene now measures minimum 45, mean 178, maximum 252, with **48.8% of opaque pixels below 203**. Nearly half the rendered geometry sits under the floor. That number belongs in the record because the alternative - describing a black-topped bench as "high-key with a darker accent" - would be the kind of claim Invariant 1.9 exists to stop.

  **What the floor protects was measured separately, and holds.** 10.1 exists so console text stays legible over what sits behind it. `tools/composite-audit.js` measures exactly that against the live canvas, worst-pixel not mean, and returns **PASS with 0 failures** in `BENCH` (9 elements) and `CALENDAR`. The consoles sit over white casework and page ground rather than over the worktop. So the blanket floor is broken and the outcome it proxies for is intact - which is the whole justification for permitting this, and also why 10.7 makes the composite audit mandatory for any new camera state rather than treating this pass as general.

  **Only the worktop needed a ruling.** The reference's saturated blue casework is `--ink-2`: the ink family is already hue 213 cool blue-grey, so the blue is reinterpreted inside the existing palette with no second accent hue, leaving Section 2.3 and D16 untouched. That is the reinterpretation DESIGN.md Section 1 already prescribes for dark references, applied to a colour one instead.

- **`bench.glb` does not go through `Model`.** `Model` normalises to a target height and seats a model's BASE at y=0, which is right for an object standing on the bench and wrong for the bench: its WORKTOP defines y=0, because that is the plane the four objects stand on. It loads at scale 1 and position 0 through a small `LabBench` component in `BenchScene.tsx`, and the material application was extracted from `Model` into an exported `applyTokenMaterials` so the bench cannot become a second, unpoliced source of colour (Invariant 1.6).

- **The `BENCH` camera state was reframed**, from `[0, 2.6, 7.2]` / `[0, 0.5, 0]` to `[0, 4.3, 11.6]` / `[0, 0.15, 0]`. The old slab had no vertical extent; the bench runs from a floor at -3.6 to a reagent shelf at +2.75, about 6.4 units, which overflowed a frame only ever built to hold a tabletop. The reagent shelf was also lifted so its lowest rail sits at 1.52 against the microscope's 1.45 height: at the first attempt the rails cut straight across the microscope's head.

### 2026-09-04: D28, the notebook's opening flip, over a phase-discipline objection

- **D28. Invariant 1.7 is overridden for the NOTEBOOK arrival transition, at the owner's explicit direction, with the invariant's stated condition knowingly unmet.** Recorded before the code, per the convention D22, D25, D26 and D27 set, and 1.7's own text is amended in place so the invariant does not sit contradicting the repo.

  **Phase 1 was not shipped and live, and that was verified rather than assumed.** product-strategist checked and found three outstanding items, not the one deployment gap this was first raised as: **hover-glow** (`BenchScene.tsx` has no pointer handlers at all), **the onboarding hint** (`components/OnboardingHint.tsx` and `Hotspot.tsx` are listed in the Section 2 tree but do not exist on disk), and **the Vercel deploy** (`README.md` and `PRODUCT.md` both still say Planned/Outstanding). By the repo's own source of truth, which Invariant 1.9 makes authoritative, Phase 1 is not live.

  **The ruling was that this is a violation, and it was overridden.** The reasoning against is recorded here rather than paraphrased away, because it may well be right: 1.7's trigger is the objective condition "before Phase 1 is shipped and live", not the softer question of whether the microscope's feel has been settled. The eyepiece dive was verified by a developer in a dev server, which is precisely the kind of verification 1.7 says is not the same as looking at the shipped thing - and it was the most-revised piece of Phase 1 work (a wrong StrictMode diagnosis, a `camera.near` bug, a four-path regression). That cost profile is what 1.7 exists to stop you paying twice. Open question 1 also remains open in this section, and its preamble says these questions "need a running Phase 1 to react to".

  **What was accepted.** The owner directed it in chat after being shown the ruling in full. The risk being taken is that the notebook's arrival may need reworking once Phase 1 is actually live and its feel questions are answered against the shipped thing.

  **Exact scope, and the rest of 1.7 still binds.**
  - Built: the NOTEBOOK arrival timeline (the three-hinge opening flip), a re-derived NOTEBOOK camera state, and `NOTEBOOK` promoted in `OBJECT_PHASE` so its hotspot navigates. Promotion is not incidental: a flip that can only be reached by hash is a flip nobody can look at, because every hash and first-paint path lands already-open by design (see below), so without promotion the override would buy nothing.
  - **Not built:** the Notebook content view. There is no publications/patents console; `#notebook` still renders the coming-soon plaque. The notebook has an arrival, not a destination.
  - **Unchanged:** CALENDAR and COMPUTER remain Phase 2, inert, with non-navigating hotspots.

- **Two live defects surfaced while planning this, both pre-existing and neither caused by the flip.** Recording them because they were found by specialist review rather than by the code failing, and would otherwise look like regressions introduced here.
  - **`CAMERA_STATES.NOTEBOOK` aimed at air.** Its target was `[-2.0, 0.35, 0.35]` while the notebook normalises to 0.076 units tall, so the aim point sat 0.274 units above the book's top face. Confirmed by looking: `#notebook` framed mostly empty worktop. This is D24's bug class again, a target carried over from primitive-era assumptions, and it was wrong before this work started.
  - **The open spread would have opened straight through the laptop.** The hinges mirror about model x -1.085, so at scale 0.4343 the spread reaches 1.365 world units left of the notebook's transform: x -3.365, against `computer.glb` spanning -3.603 to -2.497. **0.868 units of intersection**, derived twice independently. Fixed by rotating the notebook 180 degrees in `OBJECT_FACING` so the book opens toward +x into clear space, which costs a scene constant rather than a re-export, since the hinge pivots are baked into the `.glb`.

### Open questions (settle by looking, not by planning)

1. Whether the real camera move feels convincing. Reframed by D20: this is no longer "does the 2D fake convince" but "is the live move good enough to keep, or should stills be captured from this scene and fed to the retained 2D fallback". Answerable by looking, which is now possible.
2. Whether the draggable focus-knob is worth building, or plain scroll is enough.
3. Which research metrics, if any, deserve the animated metric bars in the microscope.

These are deliberately deferred: they need a running Phase 1 to react to. Do not block on them, and do not resolve them by guessing.
