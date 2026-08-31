# Bench Portfolio: System Invariants and Developer Guide

This document is a contract, not a description. If the code and this file disagree, one of them is a bug: decide which, then fix that one. The invariants below are binding. Each names an enforcer agent (see `AGENTS.md`); the ones marked blocking cannot be overridden without a written waiver recorded in Section 7 with a date and a reason.

Read `PRODUCT.md` for what the project is and why. Read `DESIGN.md` for the visual law. This file is how the code holds itself to both.

---

## 1. Non-negotiable invariants

### 1.1 High-key only

Enforcer: brand-designer (blocking). There is no dark mode anywhere. No background, console, modal, or overlay may go dark, regardless of which reference inspired it. Contrast is near-black ink on luminous white; "glow" is brighter and whiter with a cold rim, never neon on black. A dark surface is a defect. See `DESIGN.md` Section 1 and Section 7.

### 1.2 Pre-baked assets, not real-time 3D

Enforcer: scene-artist + architect. The bench is a set of baked stills (one master, one framed still per object), not a live 3D engine (no Three.js, no runtime Spline canvas). Transitions are faked in 2D (crossfade plus scale). Introducing a real-time 3D renderer is a change to this invariant and must be recorded in Section 7.

### 1.3 Placeholder-swap discipline

Enforcer: frontend-engineer. The interaction layer is built against labeled placeholder images so nothing waits on the Spline renders. Placeholder filenames in `src/assets/placeholders/` must exactly match the final filenames in `src/assets/renders/`, so swapping real art in is a drop-in with no code change. A placeholder that ships to production without being flagged in the README status table is a defect.

### 1.4 Single-page state machine, no router

Enforcer: frontend-engineer. Navigation is one finite state machine (`state/benchMachine.ts`) with states `BENCH`, `MICROSCOPE`, `NOTEBOOK`, `CALENDAR`, `COMPUTER`. No server router. Deep links are optional `#hash` only, synced to state on load and on transition. A persistent Back-to-Bench control exists in every non-`BENCH` state. No state may be unreachable or unexitable.

### 1.5 Content lives in typed data files

Enforcer: content-steward (blocking on claim accuracy). All user-visible portfolio content (research, publications, patents, timeline, AI projects) lives in `src/content/*.ts` behind the typed interfaces defined there, never hardcoded inside components. A component renders content, it does not contain it. Every factual claim (a patent number, a publication venue, a date) must be accurate as stated by the owner.

### 1.6 Tokens only

Enforcer: brand-designer. Every color, radius, spacing, duration, and type value comes from `styles/tokens.css`. A raw hex or px value in a component is a defect. Contrast is verified in a live browser against the actual composite (the blurred bench), not a flat swatch.

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
  index.html
  package.json
  vite.config.ts
  tsconfig.json
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
    assets/
      renders/                   final Spline exports
      placeholders/              labeled stand-ins, filenames match renders/
    styles/
      tokens.css                 all design tokens (loads first)
      base.css                   reset + ground
      console.css                frosted consoles and cards
  public/
```

Styling load order is fixed and load-bearing: `tokens.css` before `base.css` before `console.css`. Tokens must exist before anything references them.

---

## 3. Development workflow

```bash
npm install
npm run dev         # local dev server (Vite)
npm run typecheck   # real gate: catches broken imports and prop drift
npm run build       # production build, runs typecheck first
npm run preview     # serve the production build locally
```

Typecheck is the mandatory gate. The production build runs it first and fails on any type error.

**KNOWN GAP:** there is no automated visual/contrast audit yet. Until `tools/audit.mjs` exists, any change to `tokens.css` or to a console surface requires a manual before/after check in a live browser against the blurred bench, noted in the PR. Do not change a ground or ink token without confirming every text tier still meets its contrast floor (`DESIGN.md` Section 2 and Section 3).

---

## 4. Content model

Content is data, not markup. Each `src/content/*.ts` file exports a typed array behind the interface declared at the top of `PRODUCT.md` Section 10. To update the portfolio later, edit a data file, not a component. Phase 1 populates `research.ts` (the PDAC/Schwann-cell work plus the owner's other research items); the rest are filled in their phases. A component that renders content must degrade gracefully on an empty array (render nothing, not a broken layout).

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
- **D3. Palette.** High-key only, no dark mode, resolving the contradiction in the idea doc (Invariant 1.1). All "midnight/command-center" references reinterpret to luminous white consoles.
- **D4. Stack.** React + Vite + TypeScript, with GSAP (plus Draggable and InertiaPlugin) as the motion layer, chosen over Framer Motion because the design leans on timeline choreography and scrub interactions (the focus-knob, the calendar scrub).
- **D5. Assets.** The owner builds the Spline scene and exports the stills; the interaction layer is built against matching-filename placeholders in the meantime (Invariant 1.3).
- **D6. Transitions.** Crossfade plus scale is the Phase 1 default (easiest to implement); a pre-rendered clip for the hero microscope move is a later, optional upgrade only if the 2D zoom feels flat when viewed live.
- **D7. Scope.** Phase 1 is the full bench render plus the microscope wired end to end plus deployed live; the other three objects glow and show "coming soon" (Invariant 1.7). Mobile and sound are out of Phase 1.

### Open questions (settle by looking, not by planning)

1. Whether the crossfade-plus-scale zoom feels convincing, or the hero microscope move needs a pre-rendered clip (D6).
2. Whether the draggable focus-knob is worth building, or plain scroll is enough.
3. Which research metrics, if any, deserve the animated metric bars in the microscope.

These are deliberately deferred: they need a running Phase 1 to react to. Do not block on them, and do not resolve them by guessing.
