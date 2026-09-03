# Bench Portfolio: System Invariants and Developer Guide

This document is a contract, not a description. If the code and this file disagree, one of them is a bug: decide which, then fix that one. The invariants below are binding. Each names an enforcer agent (see `AGENTS.md`); the ones marked blocking cannot be overridden without a written waiver recorded in Section 7 with a date and a reason.

Read `PRODUCT.md` for what the project is and why. Read `DESIGN.md` for the visual law. This file is how the code holds itself to both.

---

## 1. Non-negotiable invariants

### 1.1 High-key only

Enforcer: brand-designer (blocking). There is no dark mode anywhere. No background, console, modal, or overlay may go dark, regardless of which reference inspired it. Contrast is near-black ink on luminous white; "glow" is brighter and whiter with a cold rim, never neon on black. A dark surface is a defect. See `DESIGN.md` Section 1 and Section 7.

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
      Transition.tsx             GSAP crossfade + scale
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
      palette.ts                 token bridge, reads tokens.css into the scene
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
- **D13. Motion, and one documented exception to Invariant 1.6.** GSAP ease names such as `power3.out` are strings, not valid CSS, so they cannot live in `tokens.css`. Durations stay in `tokens.css`; the ease strings live as one exported constant in `Transition.tsx` until a second consumer exists (both are Phase 2), at which point they earn a dedicated motion module. CSS easing tokens mirroring the GSAP curves were added so a CSS hover and a GSAP timeline ease identically.

**Styling approach.** Plain global CSS with the three declared stylesheets, not CSS Modules, resolving the conflict between `PRODUCT.md` Section 6 ("CSS Modules or a lightweight styling approach") and this file's Section 2, whose fixed load order is described as load-bearing. Section 2 wins because it is the binding declarative tree.

### 2026-08-31: Stage C, arbitration between Invariants 1.4 and 1.7

- **D14. Reachability versus wiring.** Invariant 1.4 names all five states and says none may be unreachable or unexitable. Invariant 1.7 says the three Phase 2 objects are "not wired to a view" until their phase. Taken literally together they conflict: a state nothing can enter is unreachable. Resolved by separating two senses of "reachable". **All five states are reachable by `#hash` and every one is exitable**, so 1.4 holds and no dead state hides in the type. What Phase 1 withholds is the wiring **from the bench**: a Phase 2 hotspot does not navigate, and a Phase 2 state renders the "coming soon" plaque rather than a content view. That is 1.7 as written, not a workaround. Phase membership is encoded once, in `OBJECT_PHASE` in `benchMachine.ts`, so promoting an object in Phase 2 is a one-line change rather than a hunt through scene files.

### 2026-09-03: Render constraints and the partial audit

- **D15. The render is governed, not assumed.** `DESIGN.md` Sections 1 through 9 govern the interface and silently assumed the imagery underneath it. That assumption does not survive contact with the material: the framed still is not a picture, it is the backdrop a translucent console has to stay legible against, and Section 2.5 forbids every CSS remedy for a bad backdrop. New `DESIGN.md` **Section 10** now carries the luminance law (a hard floor of 203 under a console, 215 to 245 target), the quiet-zone rule, the light and glow constraints, and the sRGB export requirement. Derived from the committed token values rather than estimated. Blocking, enforced by brand-designer.
- **D16. Three render rulings, arbitrated.** scene-artist and brand-designer disagreed while specifying the Spline work. Resolved in brand-designer's favour, who holds blocking authority on the palette law: **bloom off** (it produces exactly the coloured halo Section 1 prohibits), **no mint anywhere in the render** (putting the accent in the scenery retires its meaning as "interactive", which Section 2.3 forbids), and **broad object surfaces peak at 235** (the hover glow is a CSS state, so a near-white object leaves it no headroom and the hotspot feels dead).
- **D17. The audit gap is narrowed, not closed.** `tools/audit.mjs` automates every check that can be made statically and is now a mandatory gate. The composite check cannot be static, because `backdrop-filter` has no static equivalent and no render exists yet, so it stays a documented manual step in `tools/composite-audit.js`. Section 3 says so explicitly rather than claiming a closed gap, per Invariant 1.9.

### 2026-09-03: Content, and two shape amendments

- **D18. Phase 2 content data, filled early and deliberately.** `CLAUDE.md` Section 4 said the Phase 2 content files are "filled in their phases", and that was the right default while content had no source. It stopped being right the moment one document (the owner's resume, plus a DOI) made all four files fully available at once. The owner instructed the fill. This does **not** touch Invariant 1.7, whose stated reason is that the feel questions Phase 1 answers must be settled by looking before the view pattern is replicated: a typed data file carries no view, wires no hotspot, and answers no feel question. What 1.7 forbids, building the Phase 2 objects, remains unbuilt. Section 4 above is amended to say so rather than left contradicting the repo.
- **D19. Three optional fields added to the `PRODUCT.md` Section 10 shapes.** The declared shapes could not express real information that exists: a `Publication` had nowhere to record what the owner actually did on a paper, a `Patent` could record neither where it was granted nor what it does (which is most of what makes a patent worth showing), and a `TimelineEntry` could not distinguish a point-in-time award from a spanning role. Added `Publication.contribution`, `Patent.jurisdictions` and `Patent.summary`, and `TimelineEntry.kind`. All **optional**, so the declared shapes are extended rather than broken, and `PRODUCT.md` Section 10 is updated to match.
- **Awards have no content model.** `PRODUCT.md` Section 10 defines five shapes and none of them is an award, yet the resume carries four. Rather than drop them or add an undeclared sixth file (structural drift under Section 2), they live in `timeline.ts` as entries with `kind: 'award'`, which is defensible because they are dated milestones on a chronology. If a dedicated model is wanted, that is a `PRODUCT.md` change made deliberately.
- **One unsourced value, flagged not hidden.** `timeline.ts` gives the UCSD start as `2025-09`. The resume states only the expected graduation of Jun 2029, so the start is inferred from a standard four-year program. It is marked inline in the file and needs the owner's confirmation before it goes outward (Invariant 1.9).

### 2026-09-03: D20, the bench becomes one real-time scene

- **D20. Real-time 3D, with baking kept as a fallback.** Overturns the pre-baked-stills form of Invariant 1.2 and supersedes the asset half of D2, D5, and D6. The owner is authoring, editing, and iterating the 3D files themselves, and that is what decided it: on the baked path every model tweak costs two re-exports, an overlay registration check, a contrast re-verification, and two multi-megabyte binaries committed to a public repo. That loop is unaffordable while the look is still being found, and it was certain to be still being found, since the scene has never been built. On the real-time path a model revision costs a file drop and a refresh.

  Three further reasons, in descending weight. The entire fake-zoom apparatus (identical camera positions, FOV-only changes, overlay registration, a hand-computed scale factor and transform origin) existed solely to make a 2D crossfade resemble a camera move, and it disappears. One scene and one lighting rig make master-to-object consistency structural rather than something verified per export. And the bundle intuition was backwards: three.js plus React Three Fiber is roughly 180kb gzipped, while two 3200x1800 PNGs are plausibly 2 to 5MB each.

  **What did not change.** D2's retirement of photorealism stands: the look is stylised, high-key, matte, which is deliberately the easiest case to render well in real time. The baked path is retained as a documented fallback rather than deleted, because Open question 1 is exactly the kind of thing that must be settled by looking, and this way a bad answer costs a still capture instead of a rebuild.

  **Cost of the switch, measured not estimated.** Zero lines of `src/` touched art at the time of the decision, verified by grep. Stages A, B, and C survive intact. This was the cheapest moment the switch would ever cost, and it will not be this cheap again.

- **D21. Two conditions attached to D20.** First, a **token bridge**: materials and lights are set in JavaScript where nothing enforces the palette, so `three/palette.ts` reads the CSS custom properties at runtime and is the scene's only source of colour. Without it Invariant 1.6 silently stops governing half the screen. Second, **only export-ready `.glb` is committed**; source files stay out of this public repository, because every revision of a large binary is permanent in git history and the owner will be revising often.

- **`@react-three/drei` deliberately not installed.** Primitive placeholder geometry does not need it, and `PRODUCT.md` Section 6 says keep the bundle light. Revisit when model loading actually needs `useGLTF`; `useLoader` with three's own `GLTFLoader` may be enough.

### Open questions (settle by looking, not by planning)

1. Whether the crossfade-plus-scale zoom feels convincing, or the hero microscope move needs a pre-rendered clip (D6).
2. Whether the draggable focus-knob is worth building, or plain scroll is enough.
3. Which research metrics, if any, deserve the animated metric bars in the microscope.

These are deliberately deferred: they need a running Phase 1 to react to. Do not block on them, and do not resolve them by guessing.
